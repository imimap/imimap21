import * as dbHandler from "./database";
import { IInternshipModule, InternshipModule } from "../internshipModule";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("InternshipModule", () => {
  it("can be created from valid data", async () => {
    const properties = {}; // everything we need is in the default values for a normal creation
    const internshipModule: IInternshipModule = new InternshipModule(properties);

    await internshipModule.save();
    const savedInternshipModule = await InternshipModule.findOne({ aepPassed: true });

    expect(savedInternshipModule).toBeTruthy();
    if (savedInternshipModule) expect(savedInternshipModule.aepPassed).toEqual(false);
  });
  it.todo("automatically plans the internship for the upcoming semester", () => {});
});
