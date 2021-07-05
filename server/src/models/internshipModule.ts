import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { IPdfDocument, PdfDocument, PdfDocumentSchema } from "./pdfDocument";
import {
  getRecentAcceptedValueForPropSetByEvent,
  getRecentNotRejectedValueForPropSetByEvent,
} from "../helpers/eventQueryHelper";
import { Semester } from "../helpers/semesterHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";
import { EventSchema, IEvent } from "./eventModels/event";
import { IInternship, Internship } from "./internship";

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
  trySetPassed(): IInternshipModule;
  submitCompleteDocumentsPdf(creator: Types.ObjectId, newPath: string): IInternshipModule;
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
        validate: {
          validator: (value: [IEvent]) => value.length > 0,
          message: "To create a PdfDocument, submit at least one event.",
        },
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return this.events.filter((event) => event.changes?.aepPassed === true).length > 0;
});

InternshipModuleSchema.virtual("weeksTotalLongEnough").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const amountOfWeeks = this.internships
    .map((internship: IInternship) => internship.durationInWeeksSoFar)
    .reduce((a: number, b: number) => a + b, 0);
  return Math.floor(amountOfWeeks) >= 16;
});

InternshipModuleSchema.methods.plan = async function () {
  this.events.push({
    creator: (await imimapAdmin)._id,
    changes: {
      newSemester: Semester.getUpcoming().toString(),
      newSemesterOfStudy: 4,
      aepPassed: false,
    },
  });
  this.status = "planned";

  return this.save();
};

InternshipModuleSchema.methods.trySetPassed = async function () {
  if (
    this.aepPassed &&
    this.weeksTotalLongEnough &&
    this.internships?.every((internship) => internship.status === InternshipStatuses.APPROVED)
  ) {
    this.status = "passed";
    await this.save();
    return true;
  }
  return false;
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

InternshipModuleSchema.methods.passAep = async function (creator: Types.ObjectId) {
  if (this.aepPassed) throw new Error("Aep has already been passed.");

  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may declare the AEP as passed.");

  this.events.push({
    creator: creator,
    changes: {
      aepPassed: true,
    },
    accept: true,
  });
  if (
    this.weeksTotalLongEnough &&
    this.internships?.every((internship) => internship.status === InternshipStatuses.APPROVED)
  )
    this.status = "passed";

  return this.save();
};

InternshipModuleSchema.methods.submitCompleteDocumentsPdf = async function (
  creator: Types.ObjectId,
  newPath: string
) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may declare the AEP as passed.");

  const pdfDocument: IPdfDocument = new PdfDocument();

  const savedDocument = await pdfDocument.submit(user._id, newPath);
  this.completeDocumentsPdf = savedDocument;

  return this.save();
};

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
