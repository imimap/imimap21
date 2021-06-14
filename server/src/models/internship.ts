import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { ISupervisor, SupervisorSchema } from "./supervisor";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { Semester } from "../helpers/semesterHelper";
import { isValidDateRange, normalizeDate } from "../helpers/dateHelper";
import { ICompany } from "./company";

export interface IInternship extends Document {
  startDate?: Date;
  endDate?: Date;
  company?: PopulatedDoc<ICompany & Document>;
  tasks?: string;
  operationalArea?: string;
  programmingLanguages?: [string];
  livingCosts?: number;
  salary?: number;
  paymentTypes?: [string];
  workingHoursPerWeek?: number;
  supervisor?: ISupervisor;
  requestPdf?: IPdfDocument;
  lsfEctsProofPdf?: IPdfDocument;
  locationJustificationPdf?: IPdfDocument;
  contractPdf?: IPdfDocument;
  bvgTicketExemptionPdf?: IPdfDocument;
  certificatePdf?: IPdfDocument;
  // events: InternshipPartEvents
}

export const InternshipSchema = new Schema({
  startDate: {
    default: Semester.getUpcoming().startDate(),
    type: Date,
  },
  endDate: {
    type: Date,
  },
  company: {
    ref: "Company",
    type: Schema.Types.ObjectId,
  },
  tasks: {
    type: String,
  },
  operationalArea: {
    type: String,
  },
  programmingLanguages: [
    {
      type: String,
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
  paymentTypes: [
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

InternshipSchema.pre("validate", function () {
  if (this.modifiedPaths().includes("startDate")) {
    this.set("startDate", normalizeDate(this.get("startDate")));
  }
  if (this.modifiedPaths().includes("endDate")) {
    this.set("endDate", normalizeDate(this.get("endDate")));
  }
});

InternshipSchema.pre("save", function () {
  if (this.modifiedPaths().includes("endDate")) {
    const startDate = this.get("startDate");
    const endDate = this.get("endDate");
    const endDateAfterStartDate = isValidDateRange(startDate, endDate);
    if (!endDateAfterStartDate) {
      this.invalidate(
        "endDate",
        "End date is not valid. Needs to be at least 4 weeks after start date."
      );
    }
  }
});

export const Internship: Model<IInternship> = model("Internship", InternshipSchema);
