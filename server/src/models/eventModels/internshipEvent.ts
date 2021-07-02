import { Schema } from "mongoose";
import { EventSchema, IEvent } from "./event";
import { User } from "../user";

export enum InternshipStatuses {
  PLANNED = "planned",
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  OVER = "over",
  READY_FOR_GRADING = "readyForGrading",
  PASSED = "passed",
}

const adminOnlyStatuses = [
  InternshipStatuses.APPROVED,
  InternshipStatuses.REJECTED,
  InternshipStatuses.PASSED,
];

export interface IInternshipEvent extends IEvent {
  status: string;
}

export const InternshipEventSchema = new Schema({
  ...EventSchema,
  status: {
    type: String,
    enum: Object.values(InternshipStatuses),
  },
});

InternshipEventSchema.pre("save", async function () {
  const creator = await User.findById(this.get("creator"));
  if (!creator) throw "Creator (User) with that objectId does not exist.";

  const status = this.get("status");
  if (adminOnlyStatuses.indexOf(status) !== -1 && !creator.isAdmin)
    throw `Only Admins may set the status to ${status}`;
});
