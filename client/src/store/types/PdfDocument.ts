import { Event } from '@/store/types/Event';

export interface PdfDocument {
  id: string;
  events: Event[];
  status: string;
}
