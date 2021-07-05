import { config as dotenvConfig } from "dotenv";
import * as dbHandler from "./database";
import { Company } from "../../src/models/company";
import { IAddress } from "../../src/models/address";

beforeAll(async () => {
  dotenvConfig({ path: "../.env" });
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  const address: IAddress = {
    street: "Treskowallee",
    streetNumber: "8",
    zip: "10318",
    city: "Berlin",
    country: "Germany",
  };

  const properties = {
    companyName: "HTW Berlin",
    address: address,
  };
  const company = new Company(properties);

  await company.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Address", () => {
  it("can be saved for company model", async () => {
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    expect(savedCompany?.address?.city).toEqual("Berlin");
  });
  it("can retrieve the coordinates for an address", async () => {
    const savedCompany = await Company.findOne({ companyName: "HTW Berlin" });

    const latitude = savedCompany?.address?.coordinates?.latitude;
    const longitude = savedCompany?.address?.coordinates?.longitude;

    expect(latitude).toBeTruthy();
    expect(longitude).toBeTruthy();
    if (!latitude || !longitude) return;

    const roundedLatitude = Math.floor(latitude * 10000) / 10000;
    const roundedLongitude = Math.floor(longitude * 10000) / 10000;

    expect(roundedLatitude).toEqual(52.4922);
    expect(roundedLongitude).toEqual(13.5264);
  });
});
