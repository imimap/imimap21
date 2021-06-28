import * as dbHandler from "./database";
import { IInternshipModule, InternshipModule } from "../internshipModule";
import { Semester } from "../../helpers/semesterHelper";
import { IInternshipModuleScheduleEvent } from "../eventModels/internshipModuleScheduleEvent";
import { User } from "../user";
import { Types } from "mongoose";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
  // create module

  const properties = {}; // everything we need is in the default values for a normal creation
  const internshipModule: IInternshipModule = new InternshipModule(properties);

  const savedInternshipModule = await internshipModule.save();

  // create user and admin
  const studentId = "s0123456";
  const userProperties = {
    emailAddress: studentId + "@htw-berlin.de",
    firstName: "Ada",
    lastName: "Lovelace",
    studentProfile: {
      studentId: studentId,
      internship: savedInternshipModule._id,
    },
  };
  const user = new User(userProperties);
  await user.save();

  const adminProperties = {
    emailAddress: "mercury@htw-berlin.de",
    firstName: "Freddy",
    lastName: "Mercury",
    isAdmin: true,
  };
  const admin = new User(adminProperties);
  await admin.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("InternshipModule", () => {
  it("can be created from valid data", async () => {
    const savedInternshipModule = await InternshipModule.findOne({ aepPassed: false });
    expect(savedInternshipModule?.aepPassed).toEqual(false);
  });
  it("automatically plans the internship module for the upcoming semester", async () => {
    const savedInternshipModule = await InternshipModule.findOne({ aepPassed: false });
    expect(savedInternshipModule?.inSemester).toEqual(Semester.getUpcoming().toString());
  });
  it("can be scheduled for regular semester", async () => {
    const user = await User.findOne({ isAdmin: false });
    const scheduleEvent: IInternshipModuleScheduleEvent = {
      creator: user?._id,
    };

    const internshipModule = await InternshipModule.findOne({});
    internshipModule?.events.push(scheduleEvent);
    const savedInternshipModule = await internshipModule?.save();

    expect(savedInternshipModule?.events.length).toEqual(1);
    expect(savedInternshipModule?.inSemesterOfStudy).toEqual(4);
    expect(savedInternshipModule?.inSemester).toEqual(Semester.getUpcoming().toString());
    expect(savedInternshipModule?.schedulingStatus).toEqual("scheduled");
  });
  describe("postponement requests", () => {
    it("can be made for a valid semester", async () => {
      const newSemester = "WS2025";
      const user = await User.findOne({ isAdmin: false });
      const postponementRequest: IInternshipModuleScheduleEvent = {
        creator: user?._id,
        newSemester: newSemester,
        newSemesterOfStudy: 6, //todo: auto calculate newSemesterOfStudy if it is missing
      };

      const internshipModule = await InternshipModule.findOne({ aepPassed: false });
      internshipModule?.events.push(postponementRequest);
      const savedInternshipModule = await internshipModule?.save();

      expect(savedInternshipModule?.events.length).toEqual(1);
      expect(savedInternshipModule?.inSemester).toEqual(newSemester);
    });
    it("can not be made for an invalid semester", async () => {
      const newSemester = "ES2015";
      const user = await User.findOne({ isAdmin: false });
      const postponementRequest: IInternshipModuleScheduleEvent = {
        creator: user?._id,
        newSemester: newSemester,
        newSemesterOfStudy: 6,
      };

      const internshipModule = await InternshipModule.findOne({ aepPassed: false });
      internshipModule?.events.push(postponementRequest);
      await expect(internshipModule?.save()).rejects.toThrow();
    });
    it("can be accepted by admin", async () => {

    });
    it("can be rejected by admin", async () => {

    });
  });
});
