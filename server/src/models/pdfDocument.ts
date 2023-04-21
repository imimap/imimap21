import { Document, model, Model, Schema, Types } from "mongoose";
import { getRecentValueForPropSetByEvent } from "../helpers/eventQueryHelper";
import { User } from "./user";
import { EventSchema, EventTypes, IEvent } from "./event";

export enum PdfDocumentStatuses {
  UNKNOWN = "unknown",
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

function isValidPdf(path: string) {
  //example: pdfs/s0555949/s0555949_Schultz_report_3.pdf
  const pathParts = path.split("/");
  if (pathParts.length != 3) return false;
  // Test root directory
  if (pathParts[0] !== "pdfs") return false;
  // Test student id directory
  if (!/^s0[0-9]{6}$/.test(pathParts[1])) return false;
  // Test filename
  return /^s0[0-9]{6}_\p{L}+_(request|lsfEctsProof|locationJustification|contract|bvgTicketExemption|certificate|report)_[0-9]+\.pdf$/u.test(
    pathParts[2]
  );
}

class FilePathError extends Error {
  static readonly SUBMIT_NEW_FILE_ERROR = new this(
    "Invalid file path. File paths should be local and should follow this convention: " +
      "pdfs/<student-id>/<student-id>_<last-name>_<pdf-type>_<version-number>.pdf"
  );

  static readonly EXISTING_FILE_ERROR = new this(
    "The most recent file was saved using an invalid file path or file name."
  );

  constructor(message?: string) {
    super(message);
  }
}

export interface IPdfDocument extends Document {
  events: IEvent[];
  filePath: string;
  status: string;

  nextFileId(): number;

  submit(creator: Types.ObjectId, newPath: string): Promise<IPdfDocument>;

  accept(creator: Types.ObjectId, newPath?: string): Promise<IPdfDocument>;

  reject(creator: Types.ObjectId): Promise<IPdfDocument>;

  path(): string;
}

export const PdfDocumentSchema = new Schema<IPdfDocument>(
  {
    events: [
      {
        type: EventSchema,
        required: true,
        validate: {
          validator: (value: [IEvent]) => value.length > 0,
          message: "To create a PdfDocument, submit at least one event.",
        },
      },
    ],
    status: {
      type: String,
      enum: PdfDocumentStatuses,
      default: PdfDocumentStatuses.UNKNOWN,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PdfDocumentSchema.methods.path = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return getRecentValueForPropSetByEvent("newPath", this);
};

PdfDocumentSchema.methods.nextFileId = function () {
  const currentPath: string = this.path();
  if (!currentPath) return 0;
  const regexMatches = currentPath.match(/([0-9]+)\.pdf$/);
  if (!regexMatches || regexMatches.length !== 2) throw FilePathError.EXISTING_FILE_ERROR;
  try {
    return Number.parseInt(regexMatches[1]) + 1;
  } catch (e) {
    throw FilePathError.EXISTING_FILE_ERROR;
  }
};

PdfDocumentSchema.methods.submit = async function (creator: Types.ObjectId, newPath: string) {
  const user = await User.findById(creator);
  if (!user) throw new Error("Creator (User) with that objectId does not exist.");

  if (!isValidPdf(newPath)) throw FilePathError.SUBMIT_NEW_FILE_ERROR;

  this.events.push({
    type: EventTypes.PDF_UPDATE,
    creator: creator,
    changes: {
      newPath: newPath,
    },
  });
  this.status = PdfDocumentStatuses.SUBMITTED;
  return (this.$parent() ?? this).save();
};

PdfDocumentSchema.methods.accept = async function (creator: Types.ObjectId, newPath?: string) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may accept a pdf.");

  if (newPath && !isValidPdf(newPath)) throw FilePathError.SUBMIT_NEW_FILE_ERROR;

  const event: IEvent = {
    type: EventTypes.PDF_UPDATE,
    creator: creator,
    accept: true,
  };
  if (newPath) {
    event.changes = {
      newPath: newPath,
    };
  }

  this.events.push(event);
  this.status = PdfDocumentStatuses.ACCEPTED;
  return (this.$parent() ?? this).save();
};

PdfDocumentSchema.methods.reject = async function (creator: Types.ObjectId, reason: string) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may reject a pdf.");

  this.events.push({
    type: EventTypes.PDF_UPDATE,
    creator: creator,
    accept: false,
    changes: {
      status: PdfDocumentStatuses.REJECTED,
    },
    comment: reason,
  });
  this.status = PdfDocumentStatuses.REJECTED;
  return (this.$parent() ?? this).save();
};

PdfDocumentSchema.virtual("filePath").get(function (this: IPdfDocument) {
  return this.path();
});

export const PdfDocument: Model<IPdfDocument> = model("PdfDocument", PdfDocumentSchema);
