import { Document, model, Model, Schema, Types } from "mongoose";
import { getRecentValueForPropSetByEvent } from "../helpers/eventQueryHelper";
import { User } from "./user";
import { EventSchema, IEvent } from "./event";

export enum PdfDocumentStatuses {
  UNKNOWN = "unknown",
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

function isValidPdf(path: string) {
  return /http:\/\/localhost:9000\/pdfs\/s0[0-9]{6}\/[0-9a-f]{24}\/[0-9a-f]{24}\.pdf$/.test(path); //example: http://localhost:9000/pdfs/s0555949/507f1f77bcf86cd799439011/requestPdf-01.pdf
}

export interface IPdfDocument extends Document {
  events: IEvent[];
  path: string;
  status: string;
  nextPath(): string;
  submit(creator: Types.ObjectId, newPath: string): Promise<IPdfDocument>;
  accept(creator: Types.ObjectId, newPath?: string): Promise<IPdfDocument>;
  reject(creator: Types.ObjectId): Promise<IPdfDocument>;
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
  }
);

PdfDocumentSchema.virtual("path").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return getRecentValueForPropSetByEvent("newPath", this);
});

// when generating the next pdf path, this method should be used
// it makes sure that the versioning is correct
PdfDocumentSchema.methods.nextPath = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const currentPath = this.path;
  if (!currentPath) throw new Error("Path for this document is not set.");
  const pathParts = currentPath.split("/");
  pathParts.pop();
  return pathParts.join("/") + "/" + Types.ObjectId() + ".pdf";
};

PdfDocumentSchema.methods.submit = async function (creator: Types.ObjectId, newPath: string) {
  const user = await User.findById(creator);
  if (!user) throw new Error("Creator (User) with that objectId does not exist.");

  if (!isValidPdf(newPath))
    throw new Error(
      "Path is foreign or has invalid name. " +
        "PDF needs to be saved on own server and be saved under a student id and document object id, " +
        "as well as the version."
    );

  this.events.push({
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

  if (newPath && !isValidPdf(newPath))
    throw new Error(
      "Path is foreign or has invalid name. " +
        "PDF needs to be saved on own server and be saved under a student id and document object id, " +
        "as well as the version."
    );

  const event: IEvent = {
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

PdfDocumentSchema.methods.reject = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may  reject a pdf.");

  this.events.push({
    creator: creator,
    accept: false,
  });
  this.status = PdfDocumentStatuses.REJECTED;
  return (this.$parent() ?? this).save();
};

export const PdfDocument: Model<IPdfDocument> = model("PdfDocument", PdfDocumentSchema);
