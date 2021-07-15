import { Schema } from "mongoose";
import { isValidEmail } from "../helpers/emailAddressHelper";

export interface ISupervisor {
  fullName?: string;
  emailAddress?: string;
}

export const SupervisorSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    emailAddress: {
      type: String,
      validate: {
        validator: isValidEmail,
        message: "Email address is not valid",
      },
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);
