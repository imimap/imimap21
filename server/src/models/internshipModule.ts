import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { ICompany } from "./company";
import {
  IInternshipModuleScheduleEvent,
  InternshipModuleScheduleEventSchema,
} from "./eventModels/internshipModuleScheduleEvent";
import {
  getRecentAcceptedValueForPropSetByEvent,
  getRecentNotRejectedValueForPropSetByEvent,
} from "../helpers/eventQueryHelper";
import { Semester } from "../helpers/semesterHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";
import { IAepPassedEventSchema } from "./eventModels/aepPassedEvent";
import {EventSchema, IEvent} from "./eventModels/event";
import { IInternship } from "./internship";

export interface IInternshipModule extends Document {
  internships?: PopulatedDoc<IInternship & Document>[];
  inSemester: string; //should be type Semester or so, maybe an enum/ generated by function, eg "WiSe2021"
  inSemesterOfStudy: number;
  aepPassed: boolean;
  weeksTotalLongEnough: boolean;
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
  passAep(creator: Types.ObjectId): IInternshipModule;
}

const InternshipModuleSchema = new Schema<IInternshipModule>(
  {
    internships: [
      {
        ref: "Internship",
        type: Schema.Types.ObjectId,
      },
    ],
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
      },
    ],
    status: {
      type: String,
      enum: [
        "unknown",
        "planned",
        "postponement requested",
        "postponement rejected",
        "complete",
        "passed",
      ], //todo: separate postponement stati from other stati
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

InternshipModuleSchema.virtual("aepPassed").get(function () {
  let i = -1;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const events = this.events;
  while (i >= events.length * -1) {
    const recentEvent: IEvent = events.slice(i)[0];
    if (typeof recentEvent === IAepPassedEventSchema.toString()) return true;
    i--;
  }
  return false;
});

InternshipModuleSchema.virtual("weeksTotalLongEnough").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const amountOfWeeks = this.internships
    .map((internship: IInternship) => internship.durationInWeeksSoFar)
    .sum();
  return Math.floor(amountOfWeeks) >= 16;
});

InternshipModuleSchema.methods.plan = async function () {
  this.events.push({
    creator: (await imimapAdmin)._id,
    newSemester: Semester.getUpcoming().toString(),
    newSemesterOfStudy: 4,
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

  this.events.push({
    creator: creator,
    newSemester: newSemester,
    newSemesterOfStudy: newSemesterOfStudy,
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

InternshipModuleSchema.methods.passAep = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may declare the AEP as passed.");

  this.events.push({
    creator: creator,
  });
  if (this.weeksTotalLongEnough) this.status = "passed";

  return this.save();
};

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
