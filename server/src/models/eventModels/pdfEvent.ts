import { Types, Schema } from "mongoose";
import { IEvent } from "./event";
import { User } from "../user";

function isValidPdf(path: string) {
  return /http:\/\/localhost:9000\/pdfs\/s0[0-9]{6}\/[0-9a-f]{24}\/[0-9a-f]{24}\.pdf$/.test(path); //example: http://localhost:9000/pdfs/s0555949/507f1f77bcf86cd799439011/requestPdf-01.pdf
}

export interface IPdfEvent extends IEvent {
  _id?: Types.ObjectId;
  newPath?: string;
  accept?: boolean;
}

export const PdfEventSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId(),
  },
  newPath: {
    type: String,
    validate: {
      validator: isValidPdf,
      message:
        "Path is foreign or has invalid name. PDF needs to be saved on own server and be saved under a student id and document object id, as well as the version.",
    },
  },
  accept: {
    type: Boolean,
  },
  timestamp: {
    default: Date.now(),
    immutable: true,
    type: Number,
  },
  creator: {
    immutable: true,
    required: true,
    type: Schema.Types.ObjectId,
  },
});

PdfEventSchema.pre("save", async function () {
  const creator = await User.findById(this.get("creator"));

  if (this.modifiedPaths().includes("accept")) {
    if (!creator?.isAdmin) throw "Only Admins may accept or reject a pdf.";
    if (!this.get("accept") && this.modifiedPaths().includes("newPath"))
      throw "You can not set a new path while rejecting a document. Did you mean to accept it instead?";
  }
});
