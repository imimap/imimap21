import { Schema } from "mongoose";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";

export interface ISupervisor {
  fullName?: string,
  emailAddress?: string,
}

export const SupervisorSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    emailAddress: {
      type: String,
      validate: {
        validator: isValidEmail,
        message: "Email address is not valid",
      },
    },
  },
  { _id: false }
);

SupervisorSchema.pre("validate", function () {
  if (this.modifiedPaths().includes("emailAddress")) {
    this.set("emailAddress", normalizeEmail(this.get("emailAddress")));
  }
});
