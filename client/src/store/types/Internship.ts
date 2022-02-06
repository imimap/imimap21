import { Event } from '@/store/types/Event';
import { Company } from '@/store/types/Company';
import { PdfDocument } from '@/store/types/PdfDocument';
import { Evaluation } from "@/store/types/Evaluation";

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
  reportPdf: PdfDocument;
  requestPdf: PdfDocument;
  lsfEctsProofPdf: PdfDocument;
  locationJustificationPdf: PdfDocument;
  contractPdf: PdfDocument;
  bvgTicketExemptionRequestPdf: PdfDocument;
  certificatePdf: PdfDocument;
  events: Event[];
  status: string;
  evaluationFile: Evaluation,
}
