import { Schema, Types } from "mongoose";

export interface IComment {
  _id?: Types.ObjectId;
  timestamp?: number;
  author: Types.ObjectId;
  content: string;
}

export const CommentSchema = new Schema({
  timestamp: {
    type: Number,
    default: Date.now,
    immutable: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    immutable: true,
    required: true,
  },
  content: {
    type: String,
  },
});
