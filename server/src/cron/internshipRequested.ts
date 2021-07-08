import {
  Internship,
  InternshipStatuses,
  requiredFields,
  requiredPdfs,
  trySetRequested,
} from "../models/internship";
import { PdfDocumentStatuses } from "../models/pdfDocument";

export async function checkInternshipRequested(): Promise<void> {
  const query = {
    status: InternshipStatuses.PLANNED,
  };
  for (const field of requiredFields) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    query[field] = { $ne: null };
  }
  for (const pdf of requiredPdfs) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    query[`${pdf}.$.status`] = PdfDocumentStatuses.SUBMITTED;
  }
  const internships = await Internship.find(query);
  for (const internship of internships) {
    await trySetRequested(internship);
  }
}
