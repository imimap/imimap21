// export default interface Student {
//   firstName: string;
//   lastName: string;
//   emailAddress: string;
//   studentProfile: {
//     internshipsSeen: string[];
//     studentId: string;
//     internship: string;
//   };
// };

import InternshipModule from '@/models/InternshipModule';

export default class Student {
  _id = '';

  firstName = '';

  lastName = '';

  emailAddress = '';

  studentProfile = {
    internshipsSeen: [],
    studentId: '',
    internship: {} as InternshipModule,
  };
}
