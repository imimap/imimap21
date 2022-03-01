export interface PostponementRequester {
  _id: string;
  firstName: string;
  lastName: string;
  studentProfile: {
    studentId: string;
  };
}

export default class Postponement {
  _id = '';

  newSemester = '';

  newSemesterOfStudy = 1;

  reason = '';

  user: PostponementRequester = {
    _id: '',
    firstName: '',
    lastName: '',
    studentProfile: {
      studentId: '',
    },
  }
}
