export interface Question {
  _id: string;
  title: string;
  textContent: string;
  isQuestionActive: boolean;
  createdAt: string;
  updatedAt: string;
  dateToPublishQuestion: string;
  answerTextContent: string;
  answerUpdatedAt: string;
  studentAllowsToPublish: boolean;
  isAnswerReviewed: boolean;
  isAnswerPublished: boolean;
}
