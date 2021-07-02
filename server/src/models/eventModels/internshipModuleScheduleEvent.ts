import { Schema } from "mongoose";
import { EventSchema, IEvent } from "./event";
import { Semester } from "../../helpers/semesterHelper";

export interface IInternshipModuleScheduleEvent extends IEvent {
  newSemester?: string;
  newSemesterOfStudy?: number;
  accept?: boolean;
}

export const InternshipModuleScheduleEventSchema = new Schema({
  ...EventSchema,
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
});
