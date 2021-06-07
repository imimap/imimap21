import { Document, Types, Schema } from "mongoose";

export interface IEvent extends Document {
  timestamp: number,
  creator: Types.ObjectId,
  changesProperty: string,
  newPropertyValue: string,
}

export const EventSchema = new Schema({
  timestamp: {
    default: Date.now(),
    immutable: true,
    type: Number,
  },
  creator: {
    immutable: true,
    type: Schema.Types.ObjectId,
  },
  changesProperty: {
    type: String,
  },
  newPropertyValue: {
    type: String,
  },
});
