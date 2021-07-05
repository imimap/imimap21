import * as dbHandler from "./database";
import { User } from "../../src/models/user";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("User", () => {
  it("can be created from valid data", async () => {
    const properties = {
      emailAddress: "s0123456@htw-berlin.de",
      firstName: "Ada",
      lastName: "Lovelace",
    };
    const user = new User(properties);

    await user.save();

    const savedUser = await User.findOne({ firstName: "Ada" });

    expect(savedUser).toBeTruthy();
  });
});
