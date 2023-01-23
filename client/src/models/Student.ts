import InternshipModule from '@/models/InternshipModule';

export default class Student {
  _id = '';

  firstName = '';

  lastName = '';

  emailAddress = '';

  studentProfile = {
    companiesSeen: [] as string[],
    studentId: '',
    internship: {} as InternshipModule,
  };

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    emailAddress: string,
    studentProfile: { studentId: string; companiesSeen: string[]; internship: InternshipModule },
  ) {
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.studentProfile = studentProfile;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromAPIResponseData(data: any): Student {
    return new this(data._id, data.firstName, data.lastName, data.emailAddress, data.studentProfile);
  }
}
