import * as dbHandler from "./database";
import { IInternshipModule, InternshipModule } from "../../src/models/internshipModule";
import { Semester } from "../../src/helpers/semesterHelper";
import { User } from "../../src/models/user";

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
    expect(savedInternshipModule?.status).toEqual("planned");
  });
  describe("postponement requests", () => {
    it("can be made for a valid semester", async () => {
      const newSemester = "WS2025";
      const newSemesterOfStudy = 6;
      const user = await User.findOne({ isAdmin: false });

      const internshipModule = await InternshipModule.findOne({ aepPassed: false });
      const savedInternshipModule = await internshipModule?.requestPostponement(
        user?._id,
        newSemester,
        newSemesterOfStudy
      );

      expect(savedInternshipModule?.events.length).toEqual(2);
      expect(savedInternshipModule?.inSemester).toEqual(newSemester);
      expect(savedInternshipModule?.inSemesterOfStudy).toEqual(newSemesterOfStudy);
      expect(savedInternshipModule?.status).toEqual("postponement requested");
    });
    it("can not be made for an invalid semester", async () => {
      const newSemester = "ES2015";
      const user = await User.findOne({ isAdmin: false });
      const internshipModule = await InternshipModule.findOne({ aepPassed: false });
      await expect(
        internshipModule?.requestPostponement(user?._id, newSemester, 6)
      ).rejects.toThrow();
    });
    describe("admin actions: ", () => {
      beforeEach(async () => {
        const user = await User.findOne({ isAdmin: false });
        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        await internshipModule?.requestPostponement(user?._id, "WS2025", 6);
      });
      it("can be accepted by admin", async () => {
        const admin = await User.findOne({ isAdmin: true });

        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;

        const savedInternshipModule = await internshipModule?.acceptPostponement(admin?._id);

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual("planned");
        expect(savedInternshipModule?.inSemesterOfStudy).toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).toEqual(lastSetSemester);
      });
      it("can be rejected by admin", async () => {
        const admin = await User.findOne({ isAdmin: true });

        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        const lastSetSemester = internshipModule?.inSemester;
        const lastSetSemesterOfStudy = internshipModule?.inSemesterOfStudy;

        const savedInternshipModule = await internshipModule?.rejectPostponement(admin?._id);

        expect(savedInternshipModule?.events.length).toEqual(3);
        expect(savedInternshipModule?.status).toEqual("postponement rejected");
        expect(savedInternshipModule?.inSemesterOfStudy).not.toEqual(lastSetSemesterOfStudy);
        expect(savedInternshipModule?.inSemester).not.toEqual(lastSetSemester);
      });
      it("can not be accepted or rejected by a normal user", async () => {
        const user = await User.findOne({ isAdmin: false });
        const internshipModule = await InternshipModule.findOne({ aepPassed: false });
        await expect(internshipModule?.rejectPostponement(user?._id)).rejects.toThrow();
      });
    });
  });
});
