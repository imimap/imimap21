import { Document, model, Model, Schema } from "mongoose";
import { IStudentProfile, StudentProfileSchema } from "./studentProfile";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  emailAddress: string;
  studentProfile?: IStudentProfile;
}

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  emailAddress: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: isValidEmail,
      message: "Email address is not valid",
    },
  },
  studentProfile: {
    type: StudentProfileSchema,
  },
});

UserSchema.pre("save", function () {
  if (this.modifiedPaths().includes("emailAddress")) {
    this.set("emailAddress", normalizeEmail(this.get("emailAddress")));
  }
});

export const User: Model<IUser> = model("User", UserSchema);
