import { ICompany, Company } from "../company";
import * as dbHandler from "./database";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Company model", () => {
  it("can be created from valid data", async () => {
    const properties = {
      companyName: "HTW Berlin",
      branchName: "Rechenzentrum",
      /* leave out address */
      industry: "Systemadministration",
      size: "small",
      comment: "It was really nice",
    };
    const company = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany).not.toBe(null);
    if (savedCompany) expect(savedCompany.companyName).toEqual("HTW Berlin");
  });
  it("can normalize email", async () => {
    const properties = {
      companyName: "HTW Berlin",
      emailAddress: "Rechenzentrum@HTW-Berlin.de ",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany).not.toBe(null);
    if (savedCompany) expect(savedCompany.emailAddress).toEqual("rechenzentrum@htw-berlin.de");
  });
  it("can normalize website url", async () => {
    const properties = {
      companyName: "HTW Berlin",
      website: "rz.HTW-Berlin.de ",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany).not.toBe(null);
    if (savedCompany) expect(savedCompany.website).toEqual("http://rz.htw-berlin.de/");
  });
  it("will not accept something different than iso codes for mainLanguage", async () => {
    expect.assertions(1);

    const properties = {
      companyName: "HTW Berlin",
      mainLanguage: "Deutsch",
    };
    const company: ICompany = new Company(properties);

    await expect(company.save()).rejects.toThrow();
  });
  it("will accept an iso code for mainLanguage", async () => {
    const properties = {
      companyName: "HTW Berlin",
      mainLanguage: "de",
    };
    const company: ICompany = new Company(properties);

    await company.save();
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany).not.toBe(null);
    if (savedCompany) expect(savedCompany.mainLanguage).toEqual("de");
  });
});
