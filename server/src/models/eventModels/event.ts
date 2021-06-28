import { Schema, SchemaDefinition, Types } from "mongoose";

export interface IEvent {
  _id?: Types.ObjectId;
  timestamp?: number;
  creator: Types.ObjectId;
}

export const EventSchema: SchemaDefinition<IEvent> = {
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId(),
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
};
