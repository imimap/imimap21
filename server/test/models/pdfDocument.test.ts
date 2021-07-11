import * as dbHandler from "./database";
import { IPdfDocument, PdfDocument, PdfDocumentStatuses } from "../../src/models/pdfDocument";
import { Types } from "mongoose";
import { User } from "../../src/models/user";

const ADMIN_USER_ID = Types.ObjectId("0000a0000000000000000000");
const USER_ID = Types.ObjectId("0000b0000000000000000000");

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();

  // create user and admin
  const studentId = "s0123456";
  const userProperties = {
    emailAddress: studentId + "@htw-berlin.de",
    firstName: "Ada",
    lastName: "Lovelace",
    _id: USER_ID,
  };
  const user = new User(userProperties);
  const savedUser = await user.save();

  const adminProperties = {
    emailAddress: "mercury@htw-berlin.de",
    firstName: "Freddy",
    lastName: "Mercury",
    isAdmin: true,
    _id: ADMIN_USER_ID,
  };
  const admin = new User(adminProperties);
  await admin.save();

  // document
  const documentId = Types.ObjectId();
  const versionId = Types.ObjectId();
  const path =
    "http://localhost:9000/pdfs/" + studentId + "/" + documentId + "/" + versionId + ".pdf";

  const pdfDocument: IPdfDocument = new PdfDocument();
  await pdfDocument.submit(savedUser._id, path);
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("PdfDocument", () => {
  it("can be submitted via event", async () => {
    const savedDocument = await PdfDocument.findOne({});
    expect(savedDocument?.events.length).toEqual(1);
    expect(savedDocument?.path()).toBeTruthy();
    expect(savedDocument?.status).toEqual(PdfDocumentStatuses.SUBMITTED);
  });
  it("can not be submitted with invalid data", async () => {
    const path = "http://localhost:9000/pdfs/s0123456/" + Types.ObjectId() + ".pdf";
    const pdfDocument: IPdfDocument = new PdfDocument();

    await expect(pdfDocument.submit(Types.ObjectId(), path)).rejects.toThrow();
  });
  describe("can be accepted and rejected", function () {
    it("can be accepted by an admin via event and get a new path", async () => {
      const pdfDocument = await PdfDocument.findOne({});;
      const previousPath = pdfDocument?.path();
      const newPath = pdfDocument?.nextPath();

      const savedDocument = await pdfDocument?.accept(ADMIN_USER_ID, newPath);

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path()).not.toEqual(previousPath);
      expect(savedDocument?.status).toEqual(PdfDocumentStatuses.ACCEPTED);
    });
    it("can be accepted by an admin via event without a new path", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const previousPath = pdfDocument?.path();

      const savedDocument = await pdfDocument?.accept(ADMIN_USER_ID);

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path()).toEqual(previousPath);
      expect(savedDocument?.status).toEqual(PdfDocumentStatuses.ACCEPTED);
    });
    it("can be rejected by an admin via event and still get the most recent path", async () => {
      const pdfDocument = await PdfDocument.findOne({});

      const previousPath = pdfDocument?.path();

      const savedDocument = await pdfDocument?.reject(ADMIN_USER_ID);

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path()).toEqual(previousPath);
      expect(savedDocument?.status).toEqual(PdfDocumentStatuses.REJECTED);
    });
    it("can not be accepted by a regular user", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      await expect(pdfDocument?.accept(USER_ID)).rejects.toThrow();
    });
    it("can not be rejected by a regular user", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      await expect(pdfDocument?.reject(USER_ID)).rejects.toThrow();
    });
  });
});
