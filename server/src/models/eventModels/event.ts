import { Schema, SchemaDefinition, Types } from "mongoose";

export interface IEvent {
  timestamp?: number;
  creator: Types.ObjectId;
}

export const EventSchema: SchemaDefinition<IEvent> = {
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
};
