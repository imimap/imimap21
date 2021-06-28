import { Types, Schema } from "mongoose";
import { Change, ChangeSchema } from "./change";

export interface IEvent {
  timestamp?: number;
  creator: Types.ObjectId;
  changes?: [Change]; // a first draft of how this might be modelled
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
  changes: [
    {
      type: ChangeSchema,
    },
  ],
});
