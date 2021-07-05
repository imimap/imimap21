import { Document, model, Model, Schema, Types } from "mongoose";
import { IPdfEvent, PdfEventSchema } from "./eventModels/pdfEvent";
import { getRecentValueForPropSetByEvent } from "../helpers/eventQueryHelper";
import { User } from "./user";

export interface IPdfDocument extends Document {
  events: IPdfEvent[];
  path: string;
  status: string;
  nextPath(): string;
  submit(creator: Types.ObjectId, newPath: string): IPdfDocument;
  accept(creator: Types.ObjectId, newPath?: string): IPdfDocument;
  reject(creator: Types.ObjectId): IPdfDocument;
}

export const PdfDocumentSchema = new Schema<IPdfDocument>(
  {
    events: [
      {
        type: PdfEventSchema,
        validate: {
          validator: (value: [IPdfEvent]) => value.length > 0,
          message: "To create a PdfDocument, submit at least one event.",
        },
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["unknown", "submitted", "accepted", "rejected"],
      default: "unknown",
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

  this.events.push({
    newPath: newPath,
    creator: creator,
  });
  this.status = "submitted";
  return (this.$parent() ?? this).save();
};

PdfDocumentSchema.methods.accept = async function (creator: Types.ObjectId, newPath?: string) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may accept a pdf.");

  const event: IPdfEvent = {
    creator: creator,
    accept: true,
  };
  if (newPath) event.newPath = newPath;

  this.events.push(event);
  this.status = "accepted";
  return (this.$parent() ?? this).save();
};

PdfDocumentSchema.methods.reject = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may  reject a pdf.");

  this.events.push({
    creator: creator,
    accept: false,
  });
  this.status = "rejected";
  return (this.$parent() ?? this).save();
};

export const PdfDocument: Model<IPdfDocument> = model("PdfDocument", PdfDocumentSchema);
