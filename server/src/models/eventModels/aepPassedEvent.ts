import { Schema } from "mongoose";
import { EventSchema, IEvent } from "./event";

export interface IAepPassedEvent extends IEvent {
  accept: boolean;
}

export const IAepPassedEventSchema = new Schema({
  ...EventSchema,
  accept: {
    type: Boolean,
    default: true,
  },
});
