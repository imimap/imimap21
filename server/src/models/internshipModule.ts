import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { IPdfDocument, PdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { Semester } from "../helpers/semesterHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";
import { EventSchema, IEvent } from "./event";
import { IInternship, InternshipStatuses } from "./internship";

export enum InternshipModuleStatuses {
  UNKNOWN = "unknown",
  PLANNED = "planned",
  POSTPONEMENT_REQUESTED = "postponement requested",
  POSTPONEMENT_REJECTED = "postponement rejected",
  PASSED = "passed",
}

export interface IInternshipModule extends Document {
  internships?: PopulatedDoc<IInternship & Document>[];
  inSemester: string;
  inSemesterOfStudy: number;
  aepPassed: boolean;
  reportPdf?: IPdfDocument;
  completeDocumentsPdf?: IPdfDocument;
  events: IEvent[];
  status: string;

  plan(): Promise<IInternshipModule>;

  requestPostponement(
    creator: Types.ObjectId,
    newSemester: string,
    newSemesterOfStudy: number
  ): Promise<IInternshipModule>;

  acceptPostponement(creator: Types.ObjectId): Promise<IInternshipModule>;

  rejectPostponement(creator: Types.ObjectId): Promise<IInternshipModule>;

  passAep(creator: Types.ObjectId): Promise<IInternshipModule>;

  submitCompleteDocumentsPdf(creator: Types.ObjectId, newPath: string): Promise<IInternshipModule>;
}

const InternshipModuleSchema = new Schema<IInternshipModule>({
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
        message: "To create an InternshipModule, submit at least one event.",
      },
    },
  ],
  status: {
    type: String,
    enum: InternshipModuleStatuses,
    required: true,
    default: InternshipModuleStatuses.UNKNOWN,
  },
  inSemester: String,
  inSemesterOfStudy: Number,
  aepPassed: Boolean,
});

/*******************/
/*  Model Methods  */
/*******************/
InternshipModuleSchema.methods.plan = async function () {
  const defaultSemester = Semester.getUpcoming().toString();
  const defaultSemesterOfStudy = 4;
  this.events.push({
    creator: (await imimapAdmin)._id,
    accept: true,
    changes: {
      newSemester: defaultSemester,
      newSemesterOfStudy: defaultSemesterOfStudy,
      aepPassed: false,
    },
  });
  this.status = InternshipModuleStatuses.PLANNED;
  this.inSemester = defaultSemester;
  this.inSemesterOfStudy = defaultSemesterOfStudy;

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
  this.status = InternshipModuleStatuses.POSTPONEMENT_REQUESTED;

  return this.save();
};

InternshipModuleSchema.methods.acceptPostponement = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may accept a postponement.");

  this.events.push({
    creator: creator,
    accept: true,
  });
  this.status = InternshipModuleStatuses.PLANNED;
  const recentPostponementRequest = this.events
    .filter((e) => e.changes?.newSemester)
    .reduce((event, next) => ((event.timestamp ?? 0) > (next.timestamp ?? 0) ? event : next));
  this.inSemester = recentPostponementRequest.changes?.newSemester as string;
  this.inSemesterOfStudy = recentPostponementRequest.changes?.newSemesterOfStudy as number;

  return this.save();
};

InternshipModuleSchema.methods.rejectPostponement = async function (creator: Types.ObjectId) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may reject a postponement.");

  this.events.push({
    creator: creator,
    accept: false,
  });
  this.status = InternshipModuleStatuses.POSTPONEMENT_REJECTED;

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
  this.aepPassed = true;

  return this.save();
};

InternshipModuleSchema.methods.submitCompleteDocumentsPdf = async function (
  creator: Types.ObjectId,
  newPath: string
) {
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only Admins may declare the AEP as passed.");

  const pdfDocument: IPdfDocument = new PdfDocument();

  this.completeDocumentsPdf = await pdfDocument.submit(user._id, newPath);

  return this.save();
};

/*********************/
/* Model Event Hooks */
/*********************/
async function trySetPassed(document: Document) {
  await document.populate("internships").execPopulate();
  const longEnough = await isWeeksTotalLongEnough(document.get("internships"));
  const aepPassed = document.get("aepPassed");
  const statusIsPlanned = document.get("status") === InternshipModuleStatuses.PLANNED;
  if (statusIsPlanned && aepPassed && longEnough) {
    document.set("status", InternshipModuleStatuses.PASSED);
    await document.save();
    return true;
  }
  return false;
}

async function isWeeksTotalLongEnough(internships: IInternship[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const durations = internships
    .filter((i) => i.status === InternshipStatuses.PASSED)
    .map((internship: IInternship) => internship.durationInWeeksSoFar);
  const amountOfWeeks = durations.reduce((a: number, b: number) => a + b, 0);
  return Math.floor(amountOfWeeks) >= 16;
}

InternshipModuleSchema.post("save", async function () {
  await trySetPassed(this);
});

export const InternshipModule: Model<IInternshipModule> = model(
  "InternshipModule",
  InternshipModuleSchema
);
