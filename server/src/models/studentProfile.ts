import { ObjectId, Schema } from "mongoose";

export interface IStudentProfile {
  studentId: string;
  internshipsSeen: [ObjectId];
  internship: ObjectId;
}

export const StudentProfileSchema = new Schema(
  {
    studentId: {
      required: true,
      type: String,
    },
    internshipsSeen: [
      {
        ref: "Internship",
        type: Schema.Types.ObjectId,
      },
    ],
    internship: {
      ref: "Internship",
      type: Schema.Types.ObjectId,
    },
  },
  { _id: false }
);
