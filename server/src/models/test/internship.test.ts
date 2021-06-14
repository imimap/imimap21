import * as dbHandler from "./database";
import { Internship } from "../internship";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  const properties = {
    operationalArea: "Game Design",
    programmingLanguages: ["C#"],
    paymentTypes: ["noncash benefit", "cash benefit"],
  };
  const internship = new Internship(properties);

  await internship.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Internship", () => {
  it("can be created from valid data", async () => {
    const savedInternship = await Internship.findOne({ operationalArea: "Game Design" }).lean();

    expect(savedInternship).toBeTruthy();
    if (savedInternship) expect(savedInternship.paymentTypes).toContainEqual("cash benefit");
  });
  it("can be updated", async () => {
    const endDate = new Date(2010, 10, 10);
    const update = await Internship.updateOne(
      { operationalArea: "Game Design" },
      { workingHoursPerWeek: 38 },
      { runValidators: true, context: "query" }
    );

    expect(update.nModified).toEqual(1);

    const saved = await Internship.findOne({ operationalArea: "Game Design" }).lean();
    expect(saved).toBeTruthy();
    if (saved) {
      expect(saved.workingHoursPerWeek).toBeTruthy();
      expect(saved.workingHoursPerWeek).toEqual(38);
    }
  });
  it("won't save endDate that lays before startDate", async () => {
    const endDate = new Date(2010, 10, 10);
    const toBeUpdated = await Internship.findOne({ operationalArea: "Game Design" });

    expect(toBeUpdated).toBeTruthy();
    if (toBeUpdated) {
      toBeUpdated.endDate = endDate;
      await toBeUpdated.save();
    }

    const saved = await Internship.findOne({ operationalArea: "Game Design" }).lean();
    expect(saved).toBeTruthy();
    if (saved) expect(saved.endDate).toBeFalsy();
  });
});
