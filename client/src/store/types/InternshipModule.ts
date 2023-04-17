import { Event } from '@/store/types/Event';
import { Internship } from '@/store/types/Internship';

export interface InternshipModule {
  _id: string;
  internships: Internship[];
  inSemester: string;
  inSemesterOfStudy: number;
  aepPassed: boolean;
  events: Event[];
  status: string;
}
