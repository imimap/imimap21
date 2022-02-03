import {Question} from "@/store/types/Question";

export interface Evaluation {
  _id: string;
  inSemester: string;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
