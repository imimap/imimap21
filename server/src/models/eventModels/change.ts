import { Schema } from "mongoose";

export interface Change {
  [key: string]: any;
}

export const ChangeSchema = new Schema({});
