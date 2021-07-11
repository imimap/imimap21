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
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
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
    trim: true,
    lowercase: true,
  },
  studentProfile: {
    type: StudentProfileSchema,
  },
});

export const User: Model<IUser> = model("User", UserSchema);
