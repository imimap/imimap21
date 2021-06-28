import { Document, model, Model, Schema, Types } from "mongoose";
import { IPdfEvent, PdfEventSchema } from "./eventModels/pdfEvent";

export interface IPdfDocument extends Document {
  events: IPdfEvent[];
  path?: string;
  status?: string;
  nextPath(): string;
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
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
);

PdfDocumentSchema.virtual("path").get(function () {
  let recentPath;
  let i = -1; // counter starts with last element in events array
  while (!recentPath) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recentPath = this.events.slice(i)[0].newPath;
    i--;
  }
  return recentPath;
});

// when generating the next pdf path, this method should be used
// it makes sure that the versioning is correct
PdfDocumentSchema.methods.nextPath = function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const currentPath = this.path;
  if (!currentPath) throw "Path for this document is not set.";
  const pathParts = currentPath.split("/");
  pathParts.pop();
  const newPath = pathParts.join("/") + "/" + Types.ObjectId() + ".pdf";
  return newPath;
};

PdfDocumentSchema.virtual("status").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const allEvents = this.events;
  const mostRecentEvent = allEvents.slice(-1)[0];

  if (allEvents.length < 1) return "unknown";
  else if (mostRecentEvent.accept === true) return "accepted";
  else if (mostRecentEvent.accept === false) return "rejected";
  else return "submitted";
});

export const PdfDocument: Model<IPdfDocument> = model("PdfDocument", PdfDocumentSchema);
