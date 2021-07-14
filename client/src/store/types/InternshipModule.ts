import { Event } from '@/store/types/Event';

export interface InternshipModule {
  _id: string;
  internships: { [key: string]: unknown }[];
  inSemester: string;
  inSemesterOfStudy: number;
  aepPassed: boolean;
  reportPdf: { [key: string]: unknown };
  completeDocumentsPdf: { [key: string]: unknown };
  events: Event[];
  status: string;
}
