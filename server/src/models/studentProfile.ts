import { Document, PopulatedDoc, Schema } from "mongoose";
import { isValidStudentId, normalizeStudentId } from "../helpers/studentIdHelper";
import { ICompany } from "./company";

export interface IStudentProfile {
  studentId: string;
  internshipsSeen?: [PopulatedDoc<ICompany & Document>];
  internship?: PopulatedDoc<ICompany & Document>;
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
  },
  { _id: false }
);

StudentProfileSchema.pre("save", function () {
  if (this.modifiedPaths().includes("studentId")) {
    const givenId = this.get("studentId");
    this.set("studentId", normalizeStudentId(givenId));
  }
});
