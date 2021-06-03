import { Document, model, Model, ObjectId, Schema } from "mongoose";
import { ISupervisor, SupervisorSchema } from "./supervisor";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";

export interface IInternship extends Document {
  startDate: Date,
  endDate: Date,
  company: string,
  description: string,
  tasks: string,
  operationalArea: string,
  programmingLanguages: string[],
  livingCosts: number,
  salary: number,
  paymentType: [string], //should be an enum or so
  workingHoursPerWeek: number,
  supervisor: ISupervisor,
  requestPdf: IPdfDocument,
  lsfEctsProofPdf: IPdfDocument,
  locationJustificationPdf: IPdfDocument,
  contractPdf: IPdfDocument,
  bvgTicketExemptionPdf: IPdfDocument,
  certificatePdf: IPdfDocument,
  // events: InternshipPartEvents
}

export const InternshipSchema = new Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  company: {
    ref: "CompanyBranch",
    type: Schema.Types.ObjectId,
  },
  description: {
    type: String,
  },
  tasks: {
    type: String,
  },
  operationalArea: {
    type: String,
  },
  programmingLanguages: [
    {
      type: String, //should be an enum/ or so
    },
  ],
  livingCosts: {
    min: 0,
    type: Number,
  },
  salary: {
    default: 0,
    min: 0,
    type: Number,
  },
  paymentType: [
    {
      default: "uncharted",
      enum: ["uncharted", "cash benefit", "noncash benefit", "no payment"],
      type: String,
    },
  ],
  workingHoursPerWeek: {
    default: 40,
    min: 0,
    type: Number,
  },
  supervisor: SupervisorSchema,
  requestPdf: PdfDocumentSchema,
  lsfEctsProofPdf: PdfDocumentSchema,
  locationJustificationPdf: PdfDocumentSchema,
  contractPdf: PdfDocumentSchema,
  bvgTicketExemptionPdf: PdfDocumentSchema,
  certificatePdf: PdfDocumentSchema,
});

export const Internship: Model<IInternship> = model("Internship", InternshipSchema);
