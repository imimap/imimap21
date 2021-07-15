import Internship from '@/models/Internship';

export default class InternshipModule {
  id = '';

  internships = [] as Internship[];

  status = '';

  aepPassed = false;

  inSemester = '';

  inSemesterOfStudy = 1;
}
