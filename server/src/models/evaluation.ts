import {model, Model, Schema} from "mongoose";
import {IQuestion, QuestionSchema} from "./question";

export interface IEvaluation {
  inSemester: string,
  createdAt: Date;
  updatedAt: Date;
}

export const EvaluationSchema = new Schema({

  inSemester: String,
  questions: [
    {
      type: QuestionSchema,
      required: true,
      validate: {
        validator: (value: [IQuestion]) => value.length > 0,
        message: "To create an evaluation form, submit at least one event.",
      },
      // _id: false,
    }
  ],
  isPublished: {
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
});

export const Evaluation: Model<IEvaluation> = model("Evaluation", EvaluationSchema);
