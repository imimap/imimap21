import { Document, model, Model, Schema } from "mongoose";
import { IStudentProfile, StudentProfileSchema } from "./studentProfile";
import { isValidEmail } from "../helpers/emailAddressHelper";
import {IInternshipModule, InternshipModule} from "./internshipModule";

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

UserSchema.methods.hasOwnInternship = async function (internshipId: string): Promise<boolean> {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const that: IUser = this;
  if (!that.studentProfile || !that.studentProfile?.internship) return false;
  const internshipModule: IInternshipModule = await InternshipModule.findById(
    that.studentProfile.internship
  )
    .select("internships")
    .lean();

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    internshipModule?.internships?.length > 0 &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    internshipModule?.internships?.indexOf(internshipId) > -1
  );
};

export const User: Model<IUser> = model("User", UserSchema);
