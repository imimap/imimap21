import * as dbHandler from "./database";
import { IPdfDocument, PdfDocument } from "../pdfDocument";
import { Types } from "mongoose";
import { IPdfEvent } from "../eventModels/pdfEvent";
import { User } from "../user";

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
  };
  const user = new User(userProperties);
  const savedUser = await user.save();

  const adminProperties = {
    emailAddress: "mercury@htw-berlin.de",
    firstName: "Freddy",
    lastName: "Mercury",
    isAdmin: true,
  };
  const admin = new User(adminProperties);
  await admin.save();

  // document
  const documentId = Types.ObjectId();
  const versionId = Types.ObjectId();
  const path =
    "http://localhost:9000/pdfs/" + studentId + "/" + documentId + "/" + versionId + ".pdf";

  const submission: IPdfEvent = {
    _id: documentId,
    newPath: path,
    creator: savedUser._id,
  };

  const pdfDocument: IPdfDocument = new PdfDocument({ events: [submission] });
  await pdfDocument.save();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("PdfDocument", () => {
  it("can be submitted via event", async () => {
    const savedDocument = await PdfDocument.findOne({});
    expect(savedDocument?.events.length).toEqual(1);
    expect(savedDocument?.path).toBeTruthy();
    expect(savedDocument?.status).toEqual("submitted");
  });
  it("can not be submitted with invalid data", async () => {
    const path = "http://localhost:9000/pdfs/s0123456/" + Types.ObjectId() + ".pdf";
    const submission: IPdfEvent = {
      newPath: path,
      creator: Types.ObjectId(),
    };

    const pdfDocument: IPdfDocument = new PdfDocument({ events: [submission] });

    await expect(pdfDocument.save()).rejects.toThrow();
  });
  describe("can be accepted and rejected", function () {
    it("can be accepted by an admin via event and get a new path", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const admin = await User.findOne({ isAdmin: true });
      const previousPath = pdfDocument?.path;
      const newPath = pdfDocument?.nextPath();

      const acceptance: IPdfEvent = {
        newPath: newPath,
        creator: admin?._id,
        accept: true,
      };

      pdfDocument?.events.push(acceptance);
      await expect(pdfDocument?.save()).resolves.not.toThrow();

      const savedDocument = await PdfDocument.findOne({});

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path).not.toEqual(previousPath);
      expect(savedDocument?.status).toEqual("accepted");
    });
    it("can be accepted by an admin via event without a new path", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const admin = await User.findOne({ isAdmin: true });
      const previousPath = pdfDocument?.path;

      const acceptance: IPdfEvent = {
        creator: admin?._id,
        accept: true,
      };

      pdfDocument?.events.push(acceptance);
      await expect(pdfDocument?.save()).resolves.not.toThrow();

      const savedDocument = await PdfDocument.findOne({});

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path).toEqual(previousPath);
      expect(savedDocument?.status).toEqual("accepted");
    });
    it("can be rejected by an admin via event and still get the most recent path", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const admin = await User.findOne({ isAdmin: true });

      const previousPath = pdfDocument?.path;

      const rejection: IPdfEvent = {
        creator: admin?._id,
        accept: false,
      };

      pdfDocument?.events.push(rejection);
      await expect(pdfDocument?.save()).resolves.not.toThrow();

      const savedDocument = await PdfDocument.findOne({});

      expect(savedDocument?.events.length).toEqual(2);
      expect(savedDocument?.path).toEqual(previousPath);
      expect(savedDocument?.status).toEqual("rejected");
    });
    it("can not be rejected by an admin with a new path", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const admin = await User.findOne({ isAdmin: true });
      const newPath = pdfDocument?.nextPath();

      const rejection: IPdfEvent = {
        newPath: newPath,
        creator: admin?._id,
        accept: false,
      };

      pdfDocument?.events.push(rejection);
      await expect(pdfDocument?.save()).rejects.toThrow();
    });
    it("can not be accepted by a regular user", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const user = await User.findOne({ isAdmin: false });
      const acceptance: IPdfEvent = {
        creator: user?._id,
        accept: true,
      };

      pdfDocument?.events.push(acceptance);
      await expect(pdfDocument?.save()).rejects.toThrow();
    });
    it("can not be rejected by a regular user", async () => {
      const pdfDocument = await PdfDocument.findOne({});
      const user = await User.findOne({ isAdmin: false });
      const rejection: IPdfEvent = {
        creator: user?._id,
        accept: false,
      };

      pdfDocument?.events.push(rejection);
      await expect(pdfDocument?.save()).rejects.toThrow();
    });
  });
});
