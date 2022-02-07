import {Document, model, Model, Schema, Types} from "mongoose";
import { IStudentProfile, StudentProfileSchema } from "./studentProfile";
import { isValidEmail } from "../helpers/emailAddressHelper";
import {IInternship} from "./internship";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  emailAddress: string;
  studentProfile?: IStudentProfile;
  hasOwnInternship(internshipId: string): boolean;
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

UserSchema.methods.hasOwnInternship = function (internshipId: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const internships = this.studentProfile?.internship.internships.map((internship: IInternship) => {
    return internship._id;
  });

  return internships.length > 0 && internships.indexOf(internshipId) > -1;
};

export const User: Model<IUser> = model("User", UserSchema);
