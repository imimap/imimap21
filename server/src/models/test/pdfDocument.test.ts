import * as dbHandler from "./database";
import { IPdfDocument, PdfDocument } from "../pdfDocument";
import { Types } from "mongoose";

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("PdfDocument", () => {
  it("can be created from valid data", async () => {
    const objectId: Types.ObjectId = Types.ObjectId();
    const pdfId: Types.ObjectId = Types.ObjectId();
    const path = "http://localhost:9000/pdfs/s0123456/" + objectId + "/" + pdfId + ".pdf";
    const props = {
      _id: objectId,
      path: path,
    };

    const pdfDocument: IPdfDocument = new PdfDocument(props);
    await pdfDocument.save();

    const savedDocument = await PdfDocument.findById(objectId).lean();
    expect(savedDocument).toBeTruthy();
    if (savedDocument) {
      expect(savedDocument.path).toEqual(path);
    }
  });
  it("can not be created from invalid data", async () => {
    const objectId: Types.ObjectId = Types.ObjectId();
    const pdfId: Types.ObjectId = Types.ObjectId();
    const path = "http://localhost:9000/pdfs/s0123456/" + objectId + "/" + pdfId + ".pdf";
    const props = {
      _id: objectId,
      path: path,
    };

    const pdfDocument: IPdfDocument = new PdfDocument(props);
    await expect(pdfDocument.save()).rejects.toThrow();
  });
});
