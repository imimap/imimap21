import { Document, model, Model, Schema } from "mongoose";
import { IStudentProfile, StudentProfileSchema } from "./studentProfile";

export interface IUser extends Document {
  firstName: string,
  lastName: string,
  isAdmin: boolean,
  emailAddress: string,
  studentProfile: IStudentProfile
}

const UserSchema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
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
  },
  studentProfile: {
    type: StudentProfileSchema,
  },
});

export const User: Model<IUser> = model("User", UserSchema);
