import { Company } from "../company";
import * as dbHandler from "./database";
import { Internship } from "../internship";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

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
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Company model", () => {
  it("can be created from valid data", async () => {
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });
    expect(savedCompany).toBeTruthy();
    if (savedCompany) expect(savedCompany.companyName).toEqual("HTW Berlin");
  });
  it("can normalize email", async () => {
    const company = await Company.findOne({ companyName: "HTW Berlin" });
    expect(company).toBeTruthy();
    if (company) {
      company.emailAddress = "Rechenzentrum@HTW-Berlin.de ";
      await company.save();
    }

    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });
    expect(savedCompany).toBeTruthy();
    if (savedCompany) expect(savedCompany.emailAddress).toEqual("rechenzentrum@htw-berlin.de");
  });
  it("can normalize website url", async () => {
    const company = await Company.findOne({ companyName: "HTW Berlin" });
    expect(company).toBeTruthy();
    if (company) {
      company.website = "rz.HTW-Berlin.de ";
      await company.save();
    }

    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });
    expect(savedCompany).toBeTruthy();
    if (savedCompany) expect(savedCompany.website).toEqual("http://rz.htw-berlin.de/");
  });
  it("will not accept something different than iso codes for mainLanguage", async () => {
    const company = await Company.findOne({ companyName: "HTW Berlin" });
    expect(company).toBeTruthy();
    if (company) {
      company.mainLanguage = "Deutsch";
      await expect(company.save()).rejects.toThrow();
    }
  });
  it("will accept an iso code for mainLanguage", async () => {
    const company = await Company.findOne({ companyName: "HTW Berlin" });
    expect(company).toBeTruthy();
    if (company) {
      company.mainLanguage = "de";
      await company.save();
    }

    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });
    expect(savedCompany).toBeTruthy();
    if (savedCompany) expect(savedCompany.mainLanguage).toEqual("de");
  });
  it("can be saved for a certain internship", async () => {
    const company = await Company.findOne({ companyName: "HTW Berlin" });

    if (company) {
      const internship = new Internship({
        company: company._id,
        operationalArea: "Game Design",
      });
      await internship.save();
    }

    const savedInternship = await Internship.findOne({ operationalArea: "Game Design" }).populate(
      "company"
    );
    expect(savedInternship).toBeTruthy();
    if (savedInternship) {
      expect(savedInternship.company).toBeTruthy();
      if (savedInternship.company) {
        expect(savedInternship.company.companyName).toEqual("HTW Berlin");
      }
    }
  });
});
