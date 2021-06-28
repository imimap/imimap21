import { Document, model, Model, PopulatedDoc, Schema } from "mongoose";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { ICompany } from "./company";
import {
  IInternshipModuleScheduleEvent,
  InternshipModuleScheduleEventSchema,
} from "./eventModels/internshipModuleScheduleEvent";
import { getRecentNotRejectedValueForPropSetByEvent } from "../helpers/eventQueryHelper";

export interface IInternshipModule extends Document {
  internships?: [PopulatedDoc<ICompany & Document>];
  inSemester?: string;
  inSemesterOfStudy?: number;
  aepPassed?: boolean;
  reportPdf?: IPdfDocument;
  completeDocumentsPdf?: IPdfDocument;
  events: IInternshipModuleScheduleEvent[];
  schedulingStatus?: string;
}

const InternshipModuleSchema = new Schema(
  {
    internships: [
      {
        ref: "Internship",
        type: Schema.Types.ObjectId,
      },
    ],
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
        type: InternshipModuleScheduleEventSchema,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
);

InternshipModuleSchema.virtual("inSemester").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return getRecentNotRejectedValueForPropSetByEvent("newSemester", this);
});

InternshipModuleSchema.virtual("inSemesterOfStudy").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return getRecentNotRejectedValueForPropSetByEvent("newSemesterOfStudy", this);
});

InternshipModuleSchema.virtual("schedulingStatus").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const allEvents = this.events;
  const mostRecentEvent = allEvents.slice(-1)[0]; //todo: update if more event types are added

  // if (allEvents.length < 1) return "unknown"; // might need this again
  if (mostRecentEvent.accept === true) return "scheduled";
  else if (mostRecentEvent.accept === false) return "postponement rejected";
  else if (mostRecentEvent.newSemesterOfStudy !== 4) return "postponement requested";
  else return "unknown";
});

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
