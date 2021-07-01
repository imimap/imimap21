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
    expect(savedInternshipModule?.events.length).toEqual(1);
    expect(savedInternshipModule?.inSemester).toEqual(Semester.getUpcoming().toString());
    expect(savedInternshipModule?.inSemesterOfStudy).toEqual(4);
    expect(savedInternshipModule?.status).toEqual("scheduled");
  });
  describe("postponement requests", () => {
    it("can be made for a valid semester", async () => {
      const newSemester = "WS2025";
      const newSemesterOfStudy = 6;
      const user = await User.findOne({ isAdmin: false });
      const postponementRequest: IInternshipModuleScheduleEvent = {
        creator: user?._id,
        newSemester: newSemester,
        newSemesterOfStudy: newSemesterOfStudy, //todo: auto calculate newSemesterOfStudy if it is missing
      };

      const internshipModule = await InternshipModule.findOne({ aepPassed: false });
      internshipModule?.events.push(postponementRequest);
      const savedInternshipModule = await internshipModule?.save();

      expect(savedInternshipModule?.events.length).toEqual(2);
      expect(savedInternshipModule?.inSemester).toEqual(newSemester);
      expect(savedInternshipModule?.inSemesterOfStudy).toEqual(newSemesterOfStudy);
      expect(savedInternshipModule?.status).toEqual("postponement requested");
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
    describe("admin actions: ", () => {
      beforeEach(async () => {
        const newSemester = "WS2025";
        const user = await User.findOne({ isAdmin: false });
        const postponementRequest: IInternshipModuleScheduleEvent = {
          creator: user?._id,
          newSemester: newSemester,
          newSemesterOfStudy: 6, //todo: auto calculate newSemesterOfStudy if it is missing
        };

        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        internshipModule?.events.push(postponementRequest);
        await internshipModule?.save();
      });
      it("can be accepted by admin", async () => {
        const admin = await User.findOne({ isAdmin: true });
        const acceptance: IInternshipModuleScheduleEvent = {
          creator: admin?._id,
          accept: true,
        };

        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;
        internshipModule?.events.push(acceptance);
        const savedInternshipModule = await internshipModule?.save();

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual("scheduled");
        expect(savedInternshipModule?.inSemesterOfStudy).toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).toEqual(lastSetSemester);
      });
      it("can be rejected by admin", async () => {
        const admin = await User.findOne({ isAdmin: true });
        const rejection: IInternshipModuleScheduleEvent = {
          creator: admin?._id,
          accept: false,
        };

        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;
        internshipModule?.events.push(rejection);
        const savedInternshipModule = await internshipModule?.save();

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual("postponement rejected");
        expect(savedInternshipModule?.inSemesterOfStudy).not.toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).not.toEqual(lastSetSemester);
      });
    });
  });
});
