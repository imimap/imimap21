import {model, Model, Schema} from "mongoose";

export interface IFeedback {
  title: string;
  explanation: string;
  isFeedbackActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const FeedbackSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: false,
  },
  isFeedbackActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Feedback: Model<IFeedback> = model("Feedback", FeedbackSchema);




