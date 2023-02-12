import { Schema, Types } from "mongoose";

export enum EventTypes {
  INTERNSHIP_CREATE = "internship.create",
  INTERNSHIP_UPDATE = "internship.update",
  INTERNSHIP_MODULE_UPDATE = "internshipModule.plan",
  INTERNSHIP_MODULE_POSTPONEMENT = "internshipModule.postponement",
  PDF_UPDATE = "pdf.update",
}

export interface IEvent {
  timestamp?: number;
  type: EventTypes;
  creator: Types.ObjectId;
  changes?: {
    [key: string]: unknown;
  };
  accept?: boolean;
  comment?: string;
}

export const EventSchema = new Schema({
  timestamp: {
    default: Date.now,
    immutable: true,
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(EventTypes),
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
  comment: {
    type: String,
  },
});
