import { Document, PopulatedDoc, Schema } from "mongoose";
import { isValidStudentId } from "../helpers/studentIdHelper";
import { ICompany } from "./company";
import { IInternshipModule } from "./internshipModule";

export interface IStudentProfile {
  studentId: string;
  companiesSeen?: PopulatedDoc<ICompany & Document>[];
  internship?: PopulatedDoc<IInternshipModule & Document>;
}

export const StudentProfileSchema = new Schema(
  {
    studentId: {
      required: true,
      type: String,
      validate: {
        validator: isValidStudentId,
        message: "StudentId (Matrikelnummer) is not valid. Needs to be of form s0xxxxxx.",
      },
      trim: true,
      lowercase: true,
    },
    companiesSeen: [
      {
        ref: "Company",
        type: Schema.Types.ObjectId,
      },
    ],
    internship: {
      ref: "InternshipModule",
      type: Schema.Types.ObjectId,
    },
  },
  { _id: false }
);
