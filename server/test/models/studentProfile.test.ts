import * as dbHandler from "./database";
import { User } from "../../src/models/user";
import { IStudentProfile } from "../../src/models/studentProfile";
import { Types } from "mongoose";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  const studentProfile: IStudentProfile = {
    studentId: "s0123456",
  };

  const properties = {
    emailAddress: "s0123456@htw-berlin.de",
    firstName: "Ada",
    lastName: "Lovelace",
    studentProfile: studentProfile,
  };
  const user = new User(properties);

  await user.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("StudentProfile", () => {
  it("can be saved for User", async () => {
    const savedUser = await User.findOne({ firstName: "Ada" }).lean();

    expect(savedUser?.studentProfile?.studentId).toEqual("s0123456");
  });
  it("registers which internships a user has seen", async () => {
    const createdUser = await User.findOne({ firstName: "Ada" });

    //is there a way I can avoid these annoying nullish checks?
    if (!createdUser?.studentProfile?.companiesSeen) {
      throw "createdUser or one of its properties is null.";
    }

    const internshipObjectId: Types.ObjectId = Types.ObjectId();
    createdUser.studentProfile.companiesSeen.push(internshipObjectId);
    await createdUser.save();

    const updatedUser = await User.findOne({ firstName: "Ada" }).lean();
    expect(updatedUser?.studentProfile?.companiesSeen).toContainEqual(internshipObjectId);
  });
  it("can have own internships", async () => {
    const createdUser = await User.findOne({ firstName: "Ada" });

    if (!createdUser?.studentProfile) {
      throw "createdUser or one of its properties is null.";
    }

    expect(createdUser.studentProfile.internship).toBeFalsy();

    const internshipObjectId: Types.ObjectId = Types.ObjectId(); // mock an object id

    createdUser.studentProfile.internship = internshipObjectId;

    await createdUser.save();

    const updatedUser = await User.findOne({ firstName: "Ada" }).lean();

    expect(updatedUser?.studentProfile?.internship).toEqual(internshipObjectId);
  });
});
