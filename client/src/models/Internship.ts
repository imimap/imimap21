import Company from '@/models/Company';

export default class Internship {
  _id = '';

  company = '';

  companyDetails = new Company();

  tasks = '';

  operationalArea = '';

  programmingLanguages = [];

  livingCosts = 0;

  salary = 0;

  paymentTypes: string[] = [];

  startDate = '';

  endDate = '';

  workingHoursPerWeek = 0;

  supervisor: { emailAddress?: string; fullName?: string } = {};

  comment = '';

  requestPdf = '';

  lsfEctsProofPdf = '';

  locationJustificationPdfs = [];

  contractPdf = '';

  bvgTicketExemptionPdf = '';

  certificatePdf = '';

  events = [];
}
