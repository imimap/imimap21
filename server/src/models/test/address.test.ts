import * as dbHandler from "./database";
import { Company } from "../company";
import { IAddress } from "../address";

beforeAll(async () => {
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

    expect(savedCompany?.address?.coordinates?.latitude).toEqual(52.4922232);
    expect(savedCompany?.address?.coordinates?.longitude).toEqual(13.5243112);
  });
});
