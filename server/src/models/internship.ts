import { Document, model, Model, PopulatedDoc, Schema, Types } from "mongoose";
import { ISupervisor, SupervisorSchema } from "./supervisor";
import { IPdfDocument, PdfDocumentSchema } from "./pdfDocument";
import { Semester } from "../helpers/semesterHelper";
import { isValidDateRange, normalizeDate } from "../helpers/dateHelper";
import { ICompany } from "./company";
import {
  IInternshipEvent,
  InternshipEventSchema,
  InternshipStatuses,
} from "./eventModels/internshipEvent";
import { getRecentValueForPropSetByEvent } from "../helpers/eventQueryHelper";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { User } from "./user";

export interface IInternship extends Document {
  startDate?: Date;
  endDate?: Date;
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
  events: IInternshipEvent[];
  status: string;

  approve(creator: Types.ObjectId): Promise<IInternship>;

  reject(creator: Types.ObjectId): Promise<IInternship>;

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
    requestPdf: { type: PdfDocumentSchema, default: { events: [] } },
    lsfEctsProofPdf: { type: PdfDocumentSchema, default: { events: [] } },
    locationJustificationPdf: { type: PdfDocumentSchema, default: { events: [] } },
    contractPdf: { type: PdfDocumentSchema, default: { events: [] } },
    bvgTicketExemptionPdf: { type: PdfDocumentSchema, default: { events: [] } },
    certificatePdf: { type: PdfDocumentSchema, default: { events: [] } },
    reportPdf: { type: PdfDocumentSchema, default: { events: [] } },
    events: [
      {
        type: InternshipEventSchema,
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// TODO: Any required fields missing from the list?
const requiredFields = [
  "startDate",
  "endDate",
  "operationalArea",
  "tasks",
  "workingHoursPerWeek",
  "supervisor.fullName",
  "supervisor.emailAddress",
];

function internshipRequestComplete(document: Document) {
  for (const field of requiredFields) {
    if (!document.get(field)) return false;
  }
  return true;
}

async function trySetRequested(document: Document) {
  // Check if request is filled in completely
  if (internshipRequestComplete(document)) {
    const status = document.get("status");
    // If status is not 'planned', leave it as is
    if (status !== InternshipStatuses.PLANNED) return;
    // If status is 'planned', set to 'requested'
    const requestEvent: IInternshipEvent = {
      creator: (await imimapAdmin)._id,
      status: InternshipStatuses.REQUESTED,
    };
    document.get("events").push(requestEvent);
  } else {
    if (getRecentValueForPropSetByEvent("status", document) === InternshipStatuses.PLANNED) return;
    // Set status back to 'planned'
    const plannedEvent: IInternshipEvent = {
      creator: (await imimapAdmin)._id,
      status: InternshipStatuses.PLANNED,
    };
    document.get("events").push(plannedEvent);
  }
}

async function trySetReadyForGrading(document: Document) {
  const reportPdf = document.get("reportPdf");
  if (!reportPdf) return;

  const readyEvent: IInternshipEvent = {
    creator: (await imimapAdmin)._id,
    status: InternshipStatuses.READY_FOR_GRADING,
  };
  document.get("events").push(readyEvent);
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
    const createEvent: IInternshipEvent = {
      creator: (await imimapAdmin)._id,
      status: InternshipStatuses.PLANNED,
    };

    this.events.push(createEvent);
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
    status: InternshipStatuses.APPROVED,
  });

  return await this.save();
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
    status: InternshipStatuses.REJECTED,
  });

  return await this.save();
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
    status: InternshipStatuses.PASSED,
  });

  return await this.save();
};

export const Internship: Model<IInternship> = model("Internship", InternshipSchema);
