import { Event } from '@/store/types/Event';
import { Company } from '@/store/types/Company';

export interface Internship {
  _id: string;
  company: Company;
  description: string;
  tasks: string;
  operationalArea: string;
  programmingLanguages: string[];
  livingCosts: number;
  salary: number;
  paymentType: string[];
  startDate: string;
  endDate: string;
  workingHoursPerWeek: number;
  supervisor: {fullName: string; email: string};
  comment: string;
  requestPdf: string;
  lsfEctsProofPdf?: string;
  locationJustificationPdfs?: string[];
  contractPdf?: string;
  bvgTicketExemptionRequestPdf?: string;
  certificatePdf: string;
  events: Event[];
  status: string;
}
