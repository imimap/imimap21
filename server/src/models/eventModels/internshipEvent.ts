import { Schema } from "mongoose";
import { EventSchema, IEvent } from "./event";
import { User } from "../user";

export interface IInternshipEvent extends IEvent {
  status: string;
}

export const InternshipEventSchema = new Schema({
  ...EventSchema,
  status: {
    type: String,
    enum: ["planned", "requested", "approved", "rejected", "over", "readyForGrading", "passed"],
  },
});

const adminOnlyStatuses = ["rejected", "approved", "passed"];

InternshipEventSchema.pre("save", async function () {
  const creator = await User.findById(this.get("creator"));
  if (!creator) throw "Creator (User) with that objectId does not exist.";

  const status = this.get("status");
  if (adminOnlyStatuses.indexOf(status) !== -1 && !creator.isAdmin)
    throw `Only Admins may set the status to ${status}`;
});
