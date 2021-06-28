import { Types, Schema } from "mongoose";
import { IEvent } from "./event";
import { User } from "../user";
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
    default: Semester.getUpcoming(),
  },
  newSemesterOfStudy: {
    type: Number,
    default: 4,
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

InternshipModuleScheduleEventSchema.pre("save", async function () {
  const creator = await User.findById(this.get("creator"));
  if (!creator) throw "Creator (User) with that objectId does not exist.";

  if (!creator.isAdmin) {
    if (this.modifiedPaths().includes("accept")) {
      throw "Only Admins may accept or reject a postponement.";
    }

    this.set(
      "newSemester",
      Semester.sanitizeSemesterString(this.get("newSemester") || Semester.getUpcoming()));

    if (!this.modifiedPaths().includes("newSemesterOfStudy")) this.set("newSemesterOfStudy", 4);

    if (this.get("newSemesterOfStudy") === 4) this.set("accept", true);
  }
});

InternshipModuleScheduleEventSchema.post("save", async function (doc) {
  if (doc.newSemesterOfStudy === 4) doc.accept = true;
  return doc;
});
