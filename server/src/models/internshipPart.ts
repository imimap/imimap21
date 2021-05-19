import { Document, model, Model, ObjectId, Schema } from "mongoose";

export interface IInternshipPart extends Document {
  startDate: Date,
  endDate: Date,
  companyBranch: ObjectId,
  description: string,
  tasks: string,
  operationalArea: string,
  programmingLanguages: [string], //should be an enum/ or so
  livingCosts: number,
  salary: number,
  paymentType: [string], //should be an enum or so
  workingHoursPerWeek: number,
  // supervisor: Supervisor,
  // documents: Documents,
  // events: InternshipPartEvents
}

export const InternshipPartSchema = new Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  companyBranch: {
    ref: "CompanyBranch",
    type: Schema.Types.ObjectId,
  },
  description: {
    type: String,
  },
  tasks: {
    type: String,
  },
  operationalArea: {
    type: String,
  },
  programmingLanguages: [
    {
      type: String, //should be an enum/ or so
    },
  ],
  livingCosts: {
    type: Number,
  },
  salary: {
    type: Number,
  },
  paymentType: [
    {
      type: String, //should be an enum or so
    },
  ],
  workingHoursPerWeek: {
    default: 40,
    type: Number,
  },
});

export const InternshipPart: Model<IInternshipPart> = model("InternshipPart", InternshipPartSchema);
