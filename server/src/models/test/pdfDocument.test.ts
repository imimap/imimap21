import * as dbHandler from "./database";
import { IPdfDocument, PdfDocument, PdfDocumentSchema } from "../pdfDocument";
import { Types } from "mongoose";
import { IPdfEvent } from "../eventModels/pdfEvent";
import { User } from "../user";
import {doc} from "prettier";

beforeAll(async () => {
  await dbHandler.connect();

  // create user and admin
  const studentId = "s0123456";
  const userProperties = {
    emailAddress: studentId + "@htw-berlin.de",
    firstName: "Ada",
    lastName: "Lovelace",
  };
  const user = new User(userProperties);
  await user.save();

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

  const submission = {
    _id: documentId,
    newPath: path,
    creator: user._id,
  };

  const pdfDocument: IPdfDocument = new PdfDocument({ events: [submission] });
  await pdfDocument.save();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("PdfDocument", () => {
  it("can be submitted via event", async () => {
    const savedDocument = await PdfDocument.findOne({});
    expect(savedDocument).toBeTruthy();
    if (savedDocument) {
      expect(savedDocument.events.length).toEqual(1);
      expect(savedDocument.path).toBeTruthy();
    }
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
      if (pdfDocument) {
        const path = pdfDocument.nextPath();

        // todo: get admin's id
        const acceptance: IPdfEvent = {
          newPath: path,
          creator: Types.ObjectId(),
        };

        pdfDocument.events.push(acceptance);
        await pdfDocument.save();

        const savedDocument = await PdfDocument.findOne({});

        if (savedDocument) {
          expect(savedDocument.events.length).toEqual(2);
          const previousPath = pdfDocument.path;

          expect(savedDocument.path).not.toEqual(previousPath);
        }
      }
    });
    it("can be accepted by an admin via event without a new path", async () => {

    });
    it("can be rejected by an admin via event and still get the most recent path", async () => {

    });
    it("can not be accepted by a regular user", async () => {

    });
    it("can not be rejected by a regular user", async () => {

    });
  });
});
