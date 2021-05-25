import { Schema } from "mongoose";
import {isValidEmail, normalizeEmail} from "../helpers/emailAddressHelper";

export interface ISupervisor {
  firstName: string,
  lastName: string,
  emailAddress: string,
}

export const SupervisorSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailAddress: {
      required: true,
      type: String,
      validate: {
        validator: isValidEmail,
        message: "Email address is not valid",
      },
    },
  },
  { _id: false }
);

SupervisorSchema.pre("save", function () {
  if (this.modifiedPaths().includes("emailAddress")) {
    this.set("emailAddress", normalizeEmail(this.get("emailAddress")));
  }
});
