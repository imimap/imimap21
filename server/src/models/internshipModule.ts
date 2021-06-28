import { Document, model, Model, PopulatedDoc, Schema } from "mongoose";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
// import { IEvent } from "./event";
import { Semester } from "../helpers/semesterHelper";
import { ICompany } from "./company";

export interface IInternshipModule extends Document {
  internships?: [PopulatedDoc<ICompany & Document>];
  inSemester?: string; //should be type Semester or so, maybe an enum/ generated by function, eg "WiSe2021"
  inSemesterOfStudy?: number;
  aepPassed?: boolean;
  reportPdf?: IPdfDocument;
  completeDocumentsPdf?: IPdfDocument;
  //events: IInternshipEvent[], // extends Event?
}

const InternshipModuleSchema = new Schema({
  internships: [
    {
      ref: "Internship",
      type: Schema.Types.ObjectId,
    },
  ],
  inSemester: {
    type: String,
    default: Semester.getUpcoming().toString(),
  },
  inSemesterOfStudy: {
    type: Number,
    default: 4,
  },
  aepPassed: {
    type: Boolean,
    default: false,
  },
  reportPdf: {
    type: PdfDocumentSchema,
  },
  completeDocumentsPdf: {
    type: PdfDocumentSchema,
  },
  events: [
    {
      //type: InternshipEventSchema,
    },
  ],
});

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
