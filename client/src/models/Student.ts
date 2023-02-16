import InternshipModule from '@/models/InternshipModule';

export default class Student {
  _id = '';

  firstName = '';

  lastName = '';

  emailAddress = '';

  studentProfile = {
    companiesSeen: [],
    studentId: '',
    internship: {} as InternshipModule,
  };
}
