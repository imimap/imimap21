import {Document, model, Model, PopulatedDoc, Schema, Types} from "mongoose";
import { IPdfEvent, PdfEventSchema } from "./eventModels/pdfEvent";
import {isValidEmail} from "../helpers/emailAddressHelper";

export interface IPdfDocument extends Document {
  events: [IPdfEvent];
  path?: string;
  nextPath(): string;
}

export const PdfDocumentSchema = new Schema<IPdfDocument>(
  {
    events: [
      {
        type: PdfEventSchema,
      },
    ],
    validate: {
      validator: (value: [IPdfEvent]) => value.length > 0,
      message: "To create a PdfDocument, submit at least one event.",
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

PdfDocumentSchema.virtual("path").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return this.events.slice(-1)[0].newPath;
});

// when generating the next pdf path, this method should be used
// it makes sure that the versioning is correct
PdfDocumentSchema.methods.nextPath = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const currentPath = this.path;
  if (!currentPath) throw "Path for this document is not set."
  const pathParts = currentPath.split("/");
  pathParts.pop();
  return pathParts.join("/") + Types.ObjectId() + ".pdf";
};

PdfDocumentSchema.virtual("status").get(async function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const allEvents = this.events;
  const mostRecentEvent = allEvents.slice(-1)[0];

  if (allEvents.length < 1) return "unknown";
  else if (!mostRecentEvent.createdByAdmin) return "submitted";
  else if (mostRecentEvent.accept) return "accepted";
  else return "rejected";
});

export const PdfDocument: Model<IPdfDocument> = model("PdfDocument", PdfDocumentSchema);
