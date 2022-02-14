import {model, Model, Schema} from "mongoose";

export interface IQuestion {
  title: string;
  textContent: string;
  isQuestionActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  dateToPublishQuestion: Date;
  answerTextContent: string;
  answerUpdatedAt: Date;
  studentAllowsToPublish: boolean;
  isAnswerReviewed: boolean;
  isAnswerPublished: boolean;
}

export const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
  isQuestionActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  dateToPublishQuestion: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  answerTextContent: {
    type: String,
    required: true,
    default: 'Please write a neutral, detailed,  fair answer. This might help many of your fellow students to find a good internship place.',
  },
  answerUpdatedAt: {
    type: Date,
  },
  studentAllowsToPublish: {
    type: Boolean,
    default: false,
    required: true,
  },
  isAnswerReviewed: {
    type: Boolean,
    default: false,
    required: true,
  },
  isAnswerPublished: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export const Question: Model<IQuestion> = model("Question", QuestionSchema);




