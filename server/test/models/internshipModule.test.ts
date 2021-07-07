import * as dbHandler from "./database";
import {
  IInternshipModule,
  InternshipModule,
  InternshipModuleStatuses,
} from "../../src/models/internshipModule";
import { Semester } from "../../src/helpers/semesterHelper";
import { User } from "../../src/models/user";
import { Internship, InternshipStatuses } from "../../src/models/internship";
import { Types } from "mongoose";

const ADMIN_USER_ID = Types.ObjectId("0000a0000000000000000000");
const USER_ID = Types.ObjectId("0000b0000000000000000000");

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  // create module

  const properties = {}; // everything we need is in the default values for a normal creation
  const internshipModule: IInternshipModule = new InternshipModule(properties);

  const savedInternshipModule = await internshipModule.plan();

  // create user and admin
  const studentId = "s0123456";
  const userProperties = {
    emailAddress: studentId + "@htw-berlin.de",
    firstName: "Ada",
    lastName: "Lovelace",
    studentProfile: {
      studentId: studentId,
      internship: savedInternshipModule._id, //todo: at some point one should be able to add an internship more easily, maybe with a method
    },
    _id: USER_ID,
  };
  const user = new User(userProperties);
  await user.save();

  const adminProperties = {
    emailAddress: "mercury@htw-berlin.de",
    firstName: "Freddy",
    lastName: "Mercury",
    isAdmin: true,
    _id: ADMIN_USER_ID,
  };
  const admin = new User(adminProperties);
  await admin.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("InternshipModule", () => {
  it("can be created from valid data", async () => {
    const savedInternshipModule = await InternshipModule.findOne();
    expect(savedInternshipModule?.aepPassed).toEqual(false);
  });
  it("automatically plans the internship module for the upcoming semester", async () => {
    const savedInternshipModule = await InternshipModule.findOne();
    expect(savedInternshipModule?.events.length).toEqual(1);
    expect(savedInternshipModule?.inSemester).toEqual(Semester.getUpcoming().toString());
    expect(savedInternshipModule?.inSemesterOfStudy).toEqual(4);
    expect(savedInternshipModule?.status).toEqual(InternshipModuleStatuses.PLANNED);
  });
  describe("postponement requests", () => {
    it("can be made for a valid semester", async () => {
      const newSemester = "WS2025";
      const newSemesterOfStudy = 6;

      const internshipModule = await InternshipModule.findOne();
      const savedInternshipModule = await internshipModule?.requestPostponement(
        USER_ID,
        newSemester,
        newSemesterOfStudy
      );

      expect(savedInternshipModule?.events.length).toEqual(2);
      expect(savedInternshipModule?.inSemester).toEqual(newSemester);
      expect(savedInternshipModule?.inSemesterOfStudy).toEqual(newSemesterOfStudy);
      expect(savedInternshipModule?.status).toEqual(
        InternshipModuleStatuses.POSTPONEMENT_REQUESTED
      );
    });
    it("can not be made for an invalid semester", async () => {
      const newSemester = "ES2015";
      const internshipModule = await InternshipModule.findOne();
      await expect(
        internshipModule?.requestPostponement(USER_ID, newSemester, 6)
      ).rejects.toThrow();
    });
    describe("admin actions: ", () => {
      beforeEach(async () => {
        const internshipModule = await InternshipModule.findOne();
        await internshipModule?.requestPostponement(USER_ID, "WS2025", 6);
      });
      it("can be accepted by admin", async () => {
        const internshipModule = await InternshipModule.findOne();
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;

        const savedInternshipModule = await internshipModule?.acceptPostponement(ADMIN_USER_ID);

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual(InternshipModuleStatuses.PLANNED);
        expect(savedInternshipModule?.inSemesterOfStudy).toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).toEqual(lastSetSemester);
      });
      it("can be rejected by admin", async () => {
        const internshipModule = await InternshipModule.findOne();
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;

        const savedInternshipModule = await internshipModule?.rejectPostponement(ADMIN_USER_ID);

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual(
          InternshipModuleStatuses.POSTPONEMENT_REJECTED
        );
        expect(savedInternshipModule?.inSemesterOfStudy).not.toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).not.toEqual(lastSetSemester);
      });
      it("can not be accepted or rejected by a normal user", async () => {
        const internshipModule = await InternshipModule.findOne();
        await expect(internshipModule?.rejectPostponement(USER_ID)).rejects.toThrow();
      });
    });
  });
  describe("registers whether aep has been passed", () => {
    it("automatically registers module to not have passed aep", async () => {
      const savedInternshipModule = await InternshipModule.findOne();
      expect(savedInternshipModule).toBeTruthy();
      expect(savedInternshipModule?.aepPassed).toBe(false);
    });
    it("before internships have been completed", async () => {
      const savedInternshipModule = await InternshipModule.findOne();
      const updatedInternshipModule = await savedInternshipModule?.passAep(ADMIN_USER_ID);
      expect(updatedInternshipModule?.events.length).toEqual(2);
      expect(updatedInternshipModule?.aepPassed).toEqual(true);
      expect(updatedInternshipModule?.status).not.toEqual(InternshipModuleStatuses.PASSED);

      await expect(updatedInternshipModule?.passAep(ADMIN_USER_ID)).rejects.toThrow();
    });
    it("after internships have been completed", async () => {
      const savedInternshipModule = await InternshipModule.findOne();

      const internshipId = Types.ObjectId("00000000000000000000000a");
      const internship = await Internship.create({
        _id: internshipId,
        operationalArea: "Game Design",
        programmingLanguages: ["C#", "JavaScript"],
        paymentTypes: ["cash benefit"],
        startDate: new Date("2020-05-02"),
        endDate: new Date("2021-03-02"),
        tasks: "These are crazy tasks for an intern to do",
        workingHoursPerWeek: 42,
        supervisor: {
          fullName: "Peter Pan",
          emailAddress: "peter@pan.de",
        },
      });

      // fake that cron job has triggered when internship period is over
      await internship?.markAsOver(ADMIN_USER_ID);

      // fake that report has been submitted
      const user = await User.findOne({ isAdmin: false });
      const path = `http://localhost:9000/pdfs/${
        user?.studentProfile?.studentId
      }/${Types.ObjectId()}/${Types.ObjectId()}.pdf`;
      await internship?.reportPdf?.submit(USER_ID, path);

      await internship.pass(ADMIN_USER_ID);

      savedInternshipModule?.internships?.push(internshipId);
      const test = await savedInternshipModule?.save();
      console.log(test?.internships);

      const updatedInternshipModule = await savedInternshipModule?.passAep(ADMIN_USER_ID);
      expect(updatedInternshipModule?.aepPassed).toEqual(true);
      expect(updatedInternshipModule?.status).toEqual(InternshipModuleStatuses.PASSED);
    });
  });
});
