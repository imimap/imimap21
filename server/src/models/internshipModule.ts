import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { ICompany } from "./company";
import {
  getRecentAcceptedValueForPropSetByEvent,
  getRecentNotRejectedValueForPropSetByEvent,
} from "../helpers/eventQueryHelper";
import { Semester } from "../helpers/semesterHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";
import { EventSchema, IEvent } from "./eventModels/event";

export interface IInternshipModule extends Document {
  internships?: PopulatedDoc<ICompany & Document>[];
  inSemester?: string; //should be type Semester or so, maybe an enum/ generated by function, eg "WiSe2021"
  inSemesterOfStudy?: number;
  aepPassed?: boolean;
  reportPdf?: IPdfDocument;
  completeDocumentsPdf?: IPdfDocument;
  events: IEvent[];
  status: string;
  plan(): IInternshipModule;
  requestPostponement(
    creator: Types.ObjectId,
    newSemester: string,
    newSemesterOfStudy: number
  ): IInternshipModule;
  acceptPostponement(creator: Types.ObjectId): IInternshipModule;
  rejectPostponement(creator: Types.ObjectId): IInternshipModule;
}

const InternshipModuleSchema = new Schema<IInternshipModule>(
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
      enum: ["unknown", "planned", "postponement requested", "postponement rejected"], //todo: separate postponement stati from other stati
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

InternshipModuleSchema.virtual("inSemester").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const thisDocument = this;
  return thisDocument.status === "postponement rejected"
    ? getRecentAcceptedValueForPropSetByEvent("newSemester", thisDocument)
    : getRecentNotRejectedValueForPropSetByEvent("newSemester", thisDocument);
});

InternshipModuleSchema.virtual("inSemesterOfStudy").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const thisDocument = this;
  return thisDocument.status === "postponement rejected"
    ? getRecentAcceptedValueForPropSetByEvent("newSemesterOfStudy", thisDocument)
    : getRecentNotRejectedValueForPropSetByEvent("newSemesterOfStudy", thisDocument);
});

InternshipModuleSchema.methods.plan = async function () {
  this.events.push({
    creator: (await imimapAdmin)._id,
    changes: {
      newSemester: Semester.getUpcoming().toString(),
      newSemesterOfStudy: 4,
    },
  });
  this.status = "planned";

  return this.save();
};

InternshipModuleSchema.methods.requestPostponement = async function (
  creator: Types.ObjectId,
  newSemester: string,
  newSemesterOfStudy: number
) {
  const user = await User.findById(creator);
  if (!user) throw new Error("Creator (User) with that objectId does not exist.");

  if (!Semester.isValidSemesterString(newSemester))
    throw new Error(
      "Semester is not valid. Needs to be WS20XX or SS20XX (replace XX with numbers)"
    );
  if (newSemesterOfStudy < 1)
    throw new Error("SemesterOfStudy is not valid. Needs to be a positive number.");

  this.events.push({
    creator: creator,
    changes: {
      newSemester: newSemester,
      newSemesterOfStudy: newSemesterOfStudy,
    },
  });
  this.status = "postponement requested";

  return this.save();
};

InternshipModuleSchema.methods.acceptPostponement = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may accept a postponement.");

  this.events.push({
    creator: creator,
    accept: true,
  });
  this.status = "planned";

  return this.save();
};

InternshipModuleSchema.methods.rejectPostponement = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may reject a postponement.");

  this.events.push({
    creator: creator,
    accept: false,
  });
  this.status = "postponement rejected";

  return this.save();
};

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
