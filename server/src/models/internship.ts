import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { ISupervisor, SupervisorSchema } from "./supervisor";
import { IPdfDocument, PdfDocumentSchema, PdfDocumentStatuses } from "./pdfDocument";
import { Semester } from "../helpers/semesterHelper";
import { getWeeksBetween, isValidDateRange, normalizeDate } from "../helpers/dateHelper";
import { ICompany } from "./company";
import { User } from "./user";
import { EventSchema, EventTypes, IEvent } from "./event";
import { getIMIMapAdmin } from "../helpers/imimapAsAdminHelper";
import { CommentSchema, IComment } from "./comment";

export enum InternshipStatuses {
  UNKNOWN = "unknown",
  PLANNED = "planned",
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  OVER = "over",
  READY_FOR_GRADING = "readyForGrading",
  PASSED = "passed",
}

export enum PaymentTypes {
  UNCHARTED = "uncharted",
  CASH_BENEFIT = "cash benefit",
  NONCASH_BENEFIT = "noncash benefit",
  NO_PAYMENT = "no payment",
}

// TODO: Remove `extends Document` since it's not recommended to do this
// See https://mongoosejs.com/docs/typescript.html#using-extends-document
export interface IInternship extends Document {
  startDate?: Date;
  endDate?: Date;
  company?: PopulatedDoc<ICompany & Document>;
  tasks?: string;
  operationalArea?: string;
  programmingLanguages?: string[];
  livingCosts?: number; //änderbar
  salary?: number; //änderbar
  paymentTypes?: string[]; //änderbar
  workingHoursPerWeek?: number;
  supervisor?: ISupervisor;
  requestPdf?: IPdfDocument;
  lsfEctsProofPdf?: IPdfDocument;
  locationJustificationPdf?: IPdfDocument;
  contractPdf?: IPdfDocument;
  bvgTicketExemptionPdf?: IPdfDocument;
  certificatePdf?: IPdfDocument;
  reportPdf?: IPdfDocument;
  events: IEvent[];
  status: string;
  comments: IComment[];

  durationInWeeksSoFar(): number;

  approve(creator: Types.ObjectId): Promise<IInternship>;

  reject(creator: Types.ObjectId): Promise<IInternship>;

  markAsOver(creator: Types.ObjectId): Promise<IInternship>;

  pass(creator: Types.ObjectId): Promise<IInternship>;

  forcePass(creator: Types.ObjectId): Promise<IInternship>;
}

export const InternshipSchema = new Schema<IInternship>(
  {
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
      trim: true,
    },
    operationalArea: {
      type: String,
      trim: true,
    },
    programmingLanguages: [
      {
        type: String,
        trim: true,
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
        default: PaymentTypes.UNCHARTED,
        enum: PaymentTypes,
        type: String,
      },
    ],
    workingHoursPerWeek: {
      default: 40,
      min: 0,
      type: Number,
    },
    supervisor: SupervisorSchema,
    requestPdf: { type: PdfDocumentSchema, default: { events: [] } },
    lsfEctsProofPdf: { type: PdfDocumentSchema, default: { events: [] } },
    locationJustificationPdf: { type: PdfDocumentSchema, default: { events: [] } },
    contractPdf: { type: PdfDocumentSchema, default: { events: [] } },
    bvgTicketExemptionPdf: { type: PdfDocumentSchema, default: { events: [] } },
    certificatePdf: { type: PdfDocumentSchema, default: { events: [] } },
    reportPdf: { type: PdfDocumentSchema, default: { events: [] } },
    status: {
      type: String,
      required: true,
      enum: InternshipStatuses,
      default: InternshipStatuses.UNKNOWN,
    },
    events: [
      {
        type: EventSchema,
      },
    ],
    comments: [
      {
        type: CommentSchema,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const requiredFields = [
  "startDate",
  "endDate",
  "operationalArea",
  "tasks",
  "workingHoursPerWeek",
  "supervisor.fullName",
  "supervisor.emailAddress",
];

export const requiredPdfs = ["lsfEctsProofPdf", "contractPdf", "requestPdf"];

function internshipRequestComplete(document: Document) {
  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!document.get(field) || document.get(field).length < 1) return false;
  }
  // Check if all required pdf files exist
  for (const pdf of requiredPdfs) {
    if (document.get(pdf).status !== PdfDocumentStatuses.SUBMITTED) return false;
  }
  // Everything filled in, request complete
  return true;
}

export async function trySetRequested(document: Document): Promise<void> {
  // Check if request is filled in completely
  const status = document.get("status");
  const complete = internshipRequestComplete(document);
  if (complete && status === InternshipStatuses.PLANNED) {
    // If status is 'planned', set to 'requested'
    document.get("events").push({
      type: EventTypes.INTERNSHIP_UPDATE,
      creator: (await getIMIMapAdmin())._id,
      changes: {
        status: InternshipStatuses.REQUESTED,
      },
    });
    document.set("status", InternshipStatuses.REQUESTED);
  } else if (!complete && status !== InternshipStatuses.PLANNED) {
    // Set status back to 'planned'
    document.get("events").push({
      type: EventTypes.INTERNSHIP_UPDATE,
      creator: (await getIMIMapAdmin())._id,
      changes: {
        status: InternshipStatuses.PLANNED,
      },
    });
    document.set("status", InternshipStatuses.PLANNED);
  }
}

export async function trySetReadyForGrading(document: Document): Promise<void> {
  if (document.get("status") !== InternshipStatuses.OVER) return;

  const reportPdf = document.get("reportPdf");
  if (!reportPdf || reportPdf.status !== PdfDocumentStatuses.SUBMITTED) return;

  const certificatePdf = document.get("certificatePdf");
  if (!certificatePdf || certificatePdf.status !== PdfDocumentStatuses.SUBMITTED) return;

  document.get("events").push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: (await getIMIMapAdmin())._id,
    changes: {
      status: InternshipStatuses.READY_FOR_GRADING,
    },
  });
  document.set("status", InternshipStatuses.READY_FOR_GRADING);
}

/*********************/
/* Model Event Hooks */
/*********************/
InternshipSchema.pre("validate", function () {
  if (this.modifiedPaths().includes("startDate")) {
    this.set("startDate", normalizeDate(this.get("startDate")));
  }
  if (this.modifiedPaths().includes("endDate")) {
    this.set("endDate", normalizeDate(this.get("endDate")));
    // Validate minimal internship length
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

InternshipSchema.pre("save", async function () {
  if (this.isNew) {
    this.set("status", InternshipStatuses.PLANNED);
  }

  // Update internship state if necessary
  switch (this.status) {
    case InternshipStatuses.PLANNED:
    case InternshipStatuses.APPROVED:
    case InternshipStatuses.REJECTED:
      await trySetRequested(this);
      break;
    case InternshipStatuses.OVER:
      await trySetReadyForGrading(this);
      break;
  }
});

/*******************/
/*  Model Methods  */
/*******************/

InternshipSchema.methods.durationInWeeksSoFar = function (): number {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const document = this;
  let dateToCompareWith: Date = normalizeDate(new Date());
  if (document.endDate) dateToCompareWith = document.endDate;
  if (document.startDate && dateToCompareWith < document.startDate) return 0;
  return getWeeksBetween(document?.startDate || dateToCompareWith, dateToCompareWith);
};

InternshipSchema.methods.approve = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may approve an internship");
  // Check if internship is ready for approval
  if (this.status !== InternshipStatuses.REQUESTED)
    throw new Error("Internship is not ready for approval yet");

  this.events.push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    accept: true,
  });
  this.status = InternshipStatuses.APPROVED;

  return this.save();
};

InternshipSchema.methods.reject = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may reject an internship");
  // Check if internship is ready for approval
  if (this.status !== InternshipStatuses.REQUESTED)
    throw new Error("Internship is not ready for approval yet");

  this.events.push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    accept: false,
  });
  this.status = InternshipStatuses.REJECTED;

  return this.save();
};

InternshipSchema.methods.markAsOver = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin)
    throw new Error(
      "Only admins may mark an internship as over. An internship is automatically marked as over when the endDate is reached."
    );

  this.events.push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    changes: {
      status: InternshipStatuses.OVER,
    },
  });
  this.status = InternshipStatuses.OVER;

  return this.save();
};

export async function tryMarkAsOver(internship: IInternship): Promise<IInternship | undefined> {
  // Check if user is admin
  if (internship.get("endDate") <= new Date()) {
    internship.get("events").push({
      type: EventTypes.INTERNSHIP_UPDATE,
      creator: (await getIMIMapAdmin())._id,
      changes: {
        status: InternshipStatuses.OVER,
      },
    });
    internship.set("status", InternshipStatuses.OVER);
    return internship.save();
  }
}

InternshipSchema.methods.pass = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may grade an internship");
  // Check if internship is ready for grading
  if (this.status !== InternshipStatuses.READY_FOR_GRADING)
    throw new Error("Internship is not ready for grading yet");

  this.events.push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    changes: {
      status: InternshipStatuses.PASSED,
    },
  });
  this.status = InternshipStatuses.PASSED;

  return this.save();
};

InternshipSchema.methods.forcePass = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may grade an internship");
  // Check if internship is ready for grading
  this.events.push({
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    changes: {
      status: InternshipStatuses.PASSED,
    },
  });
  this.status = InternshipStatuses.PASSED;

  return this.save();
};

InternshipSchema.virtual("duration").get(function (this: IInternship) {
  return this.durationInWeeksSoFar();
});

export const Internship: Model<IInternship> = model("Internship", InternshipSchema);
