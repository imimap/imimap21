import { Document, model, Model, Schema } from "mongoose";
import { IPdfEvent, PdfEventSchema } from "./eventModels/pdfEvent";

export interface IPdfDocument extends Document {
  events: [IPdfEvent];
  path?: string;
}

export const PdfDocumentSchema = new Schema<IPdfDocument>(
  {
    events: [
      {
        type: PdfEventSchema,
      },
    ],
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
