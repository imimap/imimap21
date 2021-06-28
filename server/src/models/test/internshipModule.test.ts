import * as dbHandler from "./database";
import { IInternshipModule, InternshipModule } from "../internshipModule";
import { Semester } from "../../helpers/semesterHelper";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  const properties = {}; // everything we need is in the default values for a normal creation
  const internshipModule: IInternshipModule = new InternshipModule(properties);

  await internshipModule.save();
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
});
