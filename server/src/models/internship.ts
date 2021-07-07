import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { ISupervisor, SupervisorSchema } from "./supervisor";
import { IPdfDocument, PdfDocumentSchema, PdfDocumentStatuses } from "./pdfDocument";
import { Semester } from "../helpers/semesterHelper";
import { getWeeksBetween, isValidDateRange, normalizeDate } from "../helpers/dateHelper";
import { ICompany } from "./company";
import { getRecentValueForPropSetByEvent } from "../helpers/eventQueryHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";
import { EventSchema, IEvent } from "./event";

export interface IInternship extends Document {
  startDate?: Date;
  endDate?: Date;
  durationInWeeksSoFar: number;
  company?: PopulatedDoc<ICompany & Document>;
  tasks?: string;
  operationalArea?: string;
  programmingLanguages?: string[];
  livingCosts?: number;
  salary?: number;
  paymentTypes?: string[];
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

  approve(creator: Types.ObjectId): Promise<IInternship>;

  reject(creator: Types.ObjectId): Promise<IInternship>;

  markAsOver(creator: Types.ObjectId): Promise<IInternship>;

  pass(creator: Types.ObjectId): Promise<IInternship>;
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
    requestPdf: { type: PdfDocumentSchema, default: { events: [] } },
    lsfEctsProofPdf: { type: PdfDocumentSchema, default: { events: [] } },
    locationJustificationPdf: { type: PdfDocumentSchema, default: { events: [] } },
    contractPdf: { type: PdfDocumentSchema, default: { events: [] } },
    bvgTicketExemptionPdf: { type: PdfDocumentSchema, default: { events: [] } },
    certificatePdf: { type: PdfDocumentSchema, default: { events: [] } },
    reportPdf: { type: PdfDocumentSchema, default: { events: [] } },
    events: [
      {
        type: EventSchema,
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

export enum InternshipStatuses {
  PLANNED = "planned",
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  OVER = "over",
  READY_FOR_GRADING = "readyForGrading",
  PASSED = "passed",
}

const requiredFields = [
  "startDate",
  "endDate",
  "operationalArea",
  "tasks",
  "workingHoursPerWeek",
  "supervisor.fullName",
  "supervisor.emailAddress",
];

const requiredPdfs = [
  "lsfEctsProofPdf",
  "locationJustificationPdf",
  "contractPdf",
  //TODO: eventually add "requestPdf",
];

function internshipRequestComplete(document: Document) {
  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!document.get(field)) return false;
  }
  // Check if all required pdf files exist
  for (const pdf of requiredPdfs) {
    if (document.get(pdf).status !== PdfDocumentStatuses.SUBMITTED) return false;
  }
  // Everything filled in, request complete
  return true;
}

async function trySetRequested(document: Document) {
  // Check if request is filled in completely
  if (internshipRequestComplete(document)) {
    const status = document.get("status");
    // If status is not 'planned', leave it as is
    if (status !== InternshipStatuses.PLANNED) return;
    // If status is 'planned', set to 'requested'
    document.get("events").push({
      creator: (await imimapAdmin)._id,
      accept: true,
      changes: {
        status: InternshipStatuses.REQUESTED,
      },
    });
    // TODO what if instead we did:
    // this.status = InternshipStatuses.REQUESTED;
  } else {
    if (getRecentValueForPropSetByEvent("status", document) === InternshipStatuses.PLANNED) return;
    // Set status back to 'planned'
    document.get("events").push({
      creator: (await imimapAdmin)._id,
      accept: true,
      changes: {
        status: InternshipStatuses.PLANNED,
      },
    });
  }
}

async function trySetReadyForGrading(document: Document) {
  const reportPdf = document.get("reportPdf");
  if (!reportPdf) return;

  document.get("events").push({
    creator: (await imimapAdmin)._id,
    accept: true,
    changes: {
      status: InternshipStatuses.READY_FOR_GRADING,
    },
  });
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
    this.events.push({
      creator: (await imimapAdmin)._id,
      accept: true,
      changes: {
        status: InternshipStatuses.PLANNED,
      },
    });
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
/* Virtual Getters */
/*******************/
InternshipSchema.virtual("status").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return getRecentValueForPropSetByEvent("status", this);
});

InternshipSchema.virtual("durationInWeeksSoFar").get(function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const document = this;
  let dateToCompareWith: Date = normalizeDate(new Date());
  if (document.startDate > dateToCompareWith) return 0;
  if (document.endDate < dateToCompareWith) dateToCompareWith = document.endDate;
  return getWeeksBetween(document.startDate, dateToCompareWith);
});

/*******************/
/*  Model Methods  */
/*******************/
InternshipSchema.methods.approve = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may approve an internship");
  // Check if internship is ready for approval
  if (this.status !== InternshipStatuses.REQUESTED)
    throw new Error("Internship is not ready for approval yet");

  this.events.push({
    creator: creator,
    accept: true,
    changes: {
      status: InternshipStatuses.APPROVED,
    },
  });

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
    creator: creator,
    accept: true,
    changes: {
      status: InternshipStatuses.REJECTED,
    },
  });

  return this.save();
};

InternshipSchema.methods.markAsOver = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may mark an internship as over");

  this.events.push({
    creator: creator,
    accept: true,
    changes: {
      status: InternshipStatuses.OVER,
    },
  });

  return this.save();
};

InternshipSchema.methods.pass = async function (creator: Types.ObjectId) {
  // Check if user is admin
  const user = await User.findById(creator);
  if (!user?.isAdmin) throw new Error("Only admins may grade an internship");
  // Check if internship is ready for grading
  if (this.status !== InternshipStatuses.READY_FOR_GRADING)
    throw new Error("Internship is not ready for grading yet");

  this.events.push({
    creator: creator,
    accept: true,
    changes: {
      status: InternshipStatuses.PASSED,
    },
  });

  return this.save();
};

export const Internship: Model<IInternship> = model("Internship", InternshipSchema);
