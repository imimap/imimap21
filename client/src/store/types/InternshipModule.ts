import { Event } from '@/store/types/Event';
import { Internship } from '@/store/types/Internship';

export interface InternshipModule {
  _id: string;
  internships: Internship[];
  inSemester: string;
  inSemesterOfStudy: number;
  aepPassed: boolean;
  reportPdf: { [key: string]: unknown };
  completeDocumentsPdf: { [key: string]: unknown };
  events: Event[];
  status: string;
}
