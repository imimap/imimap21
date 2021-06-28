import { Schema } from "mongoose";

export interface Change {
  propertyName?: string;
  newPropertyValue: any;
}

export const ChangeSchema = new Schema({
  propertyName: {
    type: String,
  },
  newPropertyValue: {
    required: true,
    type: Schema.Types.Mixed,
  },
});
