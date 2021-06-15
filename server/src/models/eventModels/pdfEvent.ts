import { Types, Schema } from "mongoose";
import { IEvent } from "./event";
import { User } from "../user";

function isValidPdf(path: string) {
  return /http:\/\/localhost:9000\/pdfs\/s0[0-9]{6}\/[0-9a-f]{24}\/[0-9a-f]{24}\.pdf$/.test(path); //example: http://localhost:9000/pdfs/s0555949/507f1f77bcf86cd799439011/requestPdf-01.pdf
}

export interface IPdfEvent extends IEvent {
  newPath?: string;
  accept?: boolean;
  createdByAdmin?: boolean;
}

export const PdfEventSchema = new Schema({
  newPath: {
    type: String,
  },
  accept: {
    default: false,
    type: Boolean,
  },
  createdByAdmin: {
    default: false,
    type: Boolean,
  },
});

PdfEventSchema.pre("save", async function () {
  const creator = await User.findById(this.get("creator"));
  if (!creator) throw "Creator (User) with that objectId does not exist.";

  if (this.modifiedPaths().includes("accept")) {
    if (!creator.isAdmin) throw "Only Admins may accept or reject a pdf.";
    this.set("createdByAdmin", true);
    if (!this.get("accept") && this.modifiedPaths().includes("newPath"))
      throw "You can not set a new path while rejecting a document. Did you mean to accept it instead?";
  }

  if (this.modifiedPaths().includes("newPath")) {
    if (!isValidPdf(this.get("newPath")))
      throw "Path is foreign or has invalid name. PDF needs to be saved on own server and be saved under a student id and document object id, as well as the version.";
  }
});
