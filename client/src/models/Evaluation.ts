import Question from '@/models/Question';

export default class Evaluation {
  id = '';

  inSemester = '';

  questions = [] as Question[];

  isPublished = '';

  createdAt= '';

  updatedAt= '';
}
