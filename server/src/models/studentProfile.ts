import { Document, PopulatedDoc, Schema } from "mongoose";
import { isValidStudentId } from "../helpers/studentIdHelper";
import { IInternshipModule } from "./internshipModule";
import { IInternship } from "./internship";

export interface IStudentProfile {
  studentId: string;
  internshipsSeen?: PopulatedDoc<IInternship & Document>[];
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
    internshipsSeen: [
      {
        ref: "Internship",
        type: Schema.Types.ObjectId,
      },
    ],
    internship: {
      ref: "InternshipModule",
      type: Schema.Types.ObjectId,
    },
    showMyProfile: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);
