import Company from '@/models/Company';

export default class Internship {
  company = '';

  companyDetails = new Company();

  description = '';

  tasks = '';

  operationalArea = '';

  programmingLanguages = [];

  livingCosts = 0;

  salary = 0;

  paymentType = [];

  startDate = '';

  endDate = '';

  workingHoursPerWeek = 0;

  supervisor = {};

  comment = '';

  requestPdf = '';

  lsfEctsProofPdf = '';

  locationJustificationPdfs = [];

  contractPdf = '';

  bvgTicketExemptionRequestPdf = '';

  certificatePdf = '';

  events = [];

  evaluationFile = '';

  showMyProfile = '';
}
