import { LeanDocument } from "mongoose";
import { IUser } from "../models/user";
import { IInternship } from "../models/internship";
import * as fsPromises from "fs/promises";
import { UploadedFile } from "express-fileupload";
import { PDFDocument } from "pdf-lib";

const dateFormatter = new Intl.DateTimeFormat("de", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

/**
 * Saves an uploaded file to the disk.
 * @param file The file to save
 * @param path The path to save the file to
 * @returns Error|null Returns null if saving the file was successful, otherwise returns error
 */
export async function saveFile(file: UploadedFile, path: string): Promise<Error | null> {
  // Get path without filename
  const uploadPathParts = path.split("/");
  uploadPathParts.pop();
  const uploadDir = uploadPathParts.join("/");

  try {
    // Create parent directories if necessary
    await fsPromises.mkdir(uploadDir, { recursive: true });
    // Save file
    await file.mv(process.cwd() + "/" + path);
  } catch (e) {
    return e;
  }

  return null;
}

// let browser: Browser | null = null;

// /**
//  * Renders the given HTML content string as a PDF file
//  * @param htmlContent The HTML content for the PDF file
//  */
// export async function buildPDFFileHTML(htmlContent: string): Promise<Buffer> {
//   if (browser === null)
//     browser = await puppeteer.launch({
//       executablePath: "/usr/bin/chromium-browser",
//       args: ["--no-sandbox"],
//     });

//   const page = await browser.newPage();
//   await page.setContent(htmlContent);

//   const pdf = await page.pdf({
//     format: "a4",
//     margin: { top: "1.5cm", bottom: "1.5cm", left: "2cm", right: "1.5cm" },
//   });
//   await page.close();
//   return pdf;
// }

// /**
//  * Closes the chromium instance used by puppeteer to render HTML to PDF files
//  */
// export async function closePDFRenderer(): Promise<void> {
//   if (browser !== null && browser.isConnected()) await browser.close();
// }

// /**
//  * Loads an HTML file template and replaces the placeholders with the user's actual data.
//  * @param fileName The file to load the template from
//  * @param user The user to use for filling in the data
//  * @param internship The internship to use for filling in the data
//  * @returns string The generated HTML template
//  */
// export async function buildHtmlTemplate(
//   fileName: string,
//   user: LeanDocument<IUser>,
//   internship: LeanDocument<IInternship>
// ): Promise<string> {
//   const contentHtml = await fsPromises.readFile(`${process.cwd()}/pdf-templates/${fileName}`);
//   const html = contentHtml.toString();
//   return html
//     .replace("{{semester}}", user.studentProfile?.internship.inSemester ?? "")
//     .replace("{{studentId}}", user.studentProfile?.studentId.replace("s0", "") ?? "")
//     .replace("{{firstName}}", user.firstName ?? "")
//     .replace("{{lastName}}", user.lastName ?? "")
//     .replace("{{emailAddress}}", user.emailAddress ?? "")
//     .replace("{{company}}", internship.company.companyName ?? "")
//     .replace(
//       "{{street}}",
//       `${internship.company.address.street ?? ""} ${internship.company.address.streetNumber ?? ""}`
//     )
//     .replace("{{zipCode}}", internship.company.address.zip ?? "")
//     .replace("{{city}}", internship.company.address.city ?? "")
//     .replace("{{country}}", internship.company.address.country ?? "")
//     .replace("{{supervisor}}", internship.supervisor?.fullName ?? "")
//     .replace("{{supervisor.emailAddress}}", internship.supervisor?.emailAddress ?? "")
//     .replace(
//       "{{startDate}}",
//       internship.startDate ? dateFormatter.format(internship.startDate) : ""
//     )
//     .replace("{{endDate}}", internship.endDate ? dateFormatter.format(internship.endDate) : "")
//     .replace("{{semesterOfStudy}}", user.studentProfile?.internship.inSemesterOfStudy ?? "")
//     .replace("{{operationalArea}}", internship.operationalArea ?? "")
//     .replace("{{tasks}}", internship.tasks ?? "")
//     .replace("{{programmingLanguages}}", internship.programmingLanguages?.join(", ") ?? "");
// }

/**
 * Renders the given HTML content string as a PDF file
 * @param fileName The file to load the template from
 * @param user The user to use for filling in the data
 * @param internship The internship to use for filling in the data
 * @returns Buffer with the pdf file in it
 */
export async function buildPDFFile(
  fileName: string,
  user: LeanDocument<IUser>,
  internship: LeanDocument<IInternship>
): Promise<Buffer> {
  const contentPdf = await fsPromises.readFile(`${process.cwd()}/pdf-templates/${fileName}`);
  const pdfDoc = await PDFDocument.load(contentPdf);
  const pages = pdfDoc.getPages()
  const { width, height } = pages[0].getSize();
  const form = pdfDoc.getForm()

  form.getTextField('Semester').setText(user.studentProfile?.internship.inSemester ?? "");
  form.getTextField('Matrikelnummer').setText(user.studentProfile?.studentId.replace("s0", "") ?? "")
  form.getTextField('Vorname').setText(user.firstName ?? "")
  form.getTextField('Nachname').setText(user.lastName ?? "")
  form.getTextField('Email').setText(user.emailAddress ?? "")
  form.getTextField('Firma').setText(internship.company.companyName ?? "")
  form.getTextField('Strasse').setText(
    `${internship.company.address.street ?? ""} ${internship.company.address.streetNumber ?? ""}`
  )
  form.getTextField('PLZ').setText(internship.company.address.zip.toString() ?? "")
  form.getTextField('Stadt').setText(internship.company.address.city ?? "")
  form.getTextField('Land').setText(internship.company.address.country ?? "")
  form.getTextField('Betreuer').setText(internship.supervisor?.fullName ?? "")
  form.getTextField('BetreuerEmail').setText(internship.supervisor?.emailAddress ?? "")
  form.getTextField('Start').setText(
    internship.startDate ? dateFormatter.format(internship.startDate) : ""
  )
  form.getTextField('Ende').setText(internship.endDate ? dateFormatter.format(internship.endDate) : "")
  form.getTextField('Fachsemester').setText(user.studentProfile?.internship.inSemesterOfStudy.toString() ?? "")
  form.getTextField('Einsatz').setText(internship.operationalArea ?? "")
  form.getTextField('Thema').setText(internship.tasks ?? "")
  form.getTextField('Programmier').setText(internship.programmingLanguages?.join(", ") ?? "");

  form.flatten();
  const pdfData = await pdfDoc.save();
  var pdfBuffer = Buffer.from(pdfData);
  return pdfBuffer;
}

