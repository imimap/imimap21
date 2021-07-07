import * as dbHandler from "./database";
import { Internship, InternshipStatuses } from "../../src/models/internship";
import { Error, Types } from "mongoose";
import { User } from "../../src/models/user";
import { PdfDocumentStatuses } from "../../src/models/pdfDocument";

const INCOMPLETE_INTERNSHIP_ID = Types.ObjectId("00000000000000000000000a");
const INTERNSHIP_ID = Types.ObjectId("00000000000000000000000b");
const ADMIN_USER_ID = Types.ObjectId("0000a0000000000000000000");
const USER_ID = Types.ObjectId("0000b0000000000000000000");

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  // Create user
  await User.create({
    _id: USER_ID,
    emailAddress: "user@test.org",
    firstName: "Regular",
    lastName: "User",
    isAdmin: false,
  });

  // Create admin user
  await User.create({
    _id: ADMIN_USER_ID,
    emailAddress: "admin@test.org",
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
  });

  // Create incomplete internship
  await Internship.create({
    _id: INCOMPLETE_INTERNSHIP_ID,
    operationalArea: "Game Design",
    programmingLanguages: ["C#"],
    paymentTypes: ["noncash benefit", "cash benefit"],
  });

  // Create internship with all required fields filled in
  await Internship.create({
    _id: INTERNSHIP_ID,
    operationalArea: "Game Design",
    programmingLanguages: ["C#", "JavaScript"],
    paymentTypes: ["cash benefit"],
    startDate: new Date("2020-05-02"),
    endDate: new Date("2021-03-02"),
    tasks: "These are crazy tasks for an intern to do",
    workingHoursPerWeek: 42,
    supervisor: {
      fullName: "Peter Pan",
      emailAddress: "peter@pan.de",
    },
    lsfEctsProofPdf: {
      status: PdfDocumentStatuses.SUBMITTED,
    },
    locationJustificationPdf: {
      status: PdfDocumentStatuses.SUBMITTED,
    },
    contractPdf: {
      status: PdfDocumentStatuses.SUBMITTED,
    },
  });
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Internship", () => {
  it("can be created from valid data", async () => {
    const savedInternship = await Internship.findById(INCOMPLETE_INTERNSHIP_ID).lean();

    expect(savedInternship?.paymentTypes).toContainEqual("cash benefit");
  });

  it("has status 'planned' on creation", async () => {
    const internship = await Internship.findById(INCOMPLETE_INTERNSHIP_ID);

    expect(internship?.status).toBe(InternshipStatuses.PLANNED);
  });

  it("can be updated", async () => {
    const internship = await Internship.findById(INCOMPLETE_INTERNSHIP_ID);
    expect(internship).toBeTruthy();
    if (!internship) return;

    internship.workingHoursPerWeek = 38;
    const update = await internship.save();

    expect(update).toBeTruthy();

    const saved = await Internship.findById(INCOMPLETE_INTERNSHIP_ID).lean();

    expect(saved?.workingHoursPerWeek).toBeTruthy();
    expect(saved?.workingHoursPerWeek).toEqual(38);
  });

  it("won't save endDate that lays before startDate", async () => {
    const toBeUpdated = await Internship.findById(INCOMPLETE_INTERNSHIP_ID);

    expect(toBeUpdated).toBeTruthy();
    if (!toBeUpdated) return;

    toBeUpdated.endDate = new Date(2010, 10, 10);

    await expect(toBeUpdated.save()).rejects.toThrow(Error.ValidationError);
  });

  it("will only accept a valid paymentType", async () => {
    const toBeUpdated = await Internship.findById(INCOMPLETE_INTERNSHIP_ID);

    expect(toBeUpdated?.paymentTypes).toBeTruthy();
    toBeUpdated?.paymentTypes?.push("cash benefit");
    await toBeUpdated?.save();

    const saved = await Internship.findById(INCOMPLETE_INTERNSHIP_ID).lean();
    expect(saved?.paymentTypes).toContain("cash benefit");
  });

  it("can have a supervisor", async () => {
    const toBeUpdated = await Internship.findById(INCOMPLETE_INTERNSHIP_ID);

    expect(toBeUpdated).toBeTruthy();
    if (toBeUpdated) {
      toBeUpdated.supervisor = {
        fullName: "Douglas Adams",
        emailAddress: "d.Adams@Email.com ",
      };
      await toBeUpdated?.save();
    }

    const saved = await Internship.findById(INCOMPLETE_INTERNSHIP_ID).lean();
    expect(saved?.supervisor?.fullName).toBe("Douglas Adams");
    expect(saved?.supervisor?.emailAddress).toBe("d.adams@email.com");
  });

  it("status is set to 'requested' if all necessary properties are set", async () => {
    const internship = await Internship.findById(INTERNSHIP_ID);

    expect(internship?.status).toBe(InternshipStatuses.REQUESTED);
  });

  it("may be approved by admins", async () => {
    const internship = await Internship.findById(INTERNSHIP_ID);

    const approvedInternship = await internship?.approve(ADMIN_USER_ID);

    expect(approvedInternship?.status).toBe(InternshipStatuses.APPROVED);
  });

  it("may be rejected by admins", async () => {
    const internship = await Internship.findById(INTERNSHIP_ID);

    const approvedInternship = await internship?.reject(ADMIN_USER_ID);

    expect(approvedInternship?.status).toBe(InternshipStatuses.REJECTED);
  });

  it("may not be approved or rejected by regular users", async () => {
    const internship = await Internship.findById(INTERNSHIP_ID);

    await expect(internship?.approve(USER_ID)).rejects.toThrow();
    await expect(internship?.reject(USER_ID)).rejects.toThrow();
  });

  it("may be marked as passed by admins", async () => {
    const internship = await Internship.findById(INTERNSHIP_ID);

    await internship?.markAsOver(ADMIN_USER_ID);
    const path = `http://localhost:9000/pdfs/s0100000/${Types.ObjectId()}/${Types.ObjectId()}.pdf`;
    await internship?.reportPdf?.submit(USER_ID, path);

    const approvedInternship = await internship?.pass(ADMIN_USER_ID);

    expect(approvedInternship?.status).toBe(InternshipStatuses.PASSED);
  });
});
