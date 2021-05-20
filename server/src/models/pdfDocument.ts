import { Document, Schema } from "mongoose";
import { EventSchema, IEvent } from "./event";

function isValidPdf(path: string) {
  return /http:\/\/localhost:9000\/pdfs\/s0[0-9]{6}\/[0-9a-f]{12}\//.test(path); //example: http://localhost:9000/pdfs/s0555949/507f1f77bcf86cd799439011/requestPdf-01.pdf
}

const validatePdf = {
  validator: isValidPdf,
  message: "Path is foreign. PDF needs to be saved on own server.",
};

export interface IPdfDocument extends Document {
  path: string,
  events: IEvent[],
}

export const PdfDocumentSchema = new Schema({
  path: {
    type: String,
    validate: validatePdf,
  },
  events: [
    {
      type: EventSchema,
    },
  ],
});
