import { Types, Schema, SchemaDefinition } from "mongoose";
import { Change, ChangeSchema } from "./change";

export interface IEvent {
  timestamp?: number;
  creator: Types.ObjectId;
  changes?: {
    [key: string]: any;
  };
}

export const EventSchema = new Schema({
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
  changes: {
    type: Schema.Types.Mixed,
  },
});
