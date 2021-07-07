import { Schema, Types } from "mongoose";

export interface IEvent {
  timestamp?: number;
  creator: Types.ObjectId;
  changes?: {
    [key: string]: unknown;
  };
  accept?: boolean;
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
  accept: {
    type: Boolean,
  },
});
