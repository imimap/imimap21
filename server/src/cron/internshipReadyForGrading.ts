import { Internship, InternshipStatuses, trySetReadyForGrading } from "../models/internship";
import { PdfDocumentStatuses } from "../models/pdfDocument";

export async function checkInternshipReadyForGrading(): Promise<void> {
  const internships = await Internship.find({
    status: InternshipStatuses.OVER,
    "reportPdf.$.status": PdfDocumentStatuses.SUBMITTED,
    "certificatePdf.$.status": PdfDocumentStatuses.SUBMITTED,
  });
  for (const internship of internships) {
    await trySetReadyForGrading(internship);
  }
}
