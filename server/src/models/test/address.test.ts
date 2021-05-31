import { IAddress, AddressSchema } from "../address";
import * as dbHandler from "./database";

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Address model", () => {
  it("can be created from valid data", async () => {

  });
});
