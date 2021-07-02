import { Types, Schema } from "mongoose";
import { IEvent } from "./event";
import { Semester } from "../../helpers/semesterHelper";

export interface IInternshipModuleScheduleEvent extends IEvent {
  _id?: Types.ObjectId;
  newSemester?: string;
  newSemesterOfStudy?: number;
  accept?: boolean;
}

export const InternshipModuleScheduleEventSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId(),
  },
  newSemester: {
    type: String,
    validate: {
      validator: Semester.isValidSemesterString,
      message: "Semester is not valid. Needs to be WS20XX or SS20XX (replace XX with numbers)",
    },
  },
  newSemesterOfStudy: {
    type: Number,
    min: 1,
  },
  accept: {
    type: Boolean,
  },
  timestamp: {
    default: Date.now(),
    immutable: true,
    type: Number,
  },
  creator: {
    immutable: true,
    required: true,
    type: Schema.Types.ObjectId,
  },
});
