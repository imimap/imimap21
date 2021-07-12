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

export default class Student {
  firstName = '';

  lastName = '';

  emailAddress = '';

  studentProfile = {
    internshipsSeen: [],
    studentId: '',
    internship: '',
  };
}
