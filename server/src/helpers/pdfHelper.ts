import { LeanDocument } from "mongoose";
import { IUser } from "../models/user";
import { IInternship } from "../models/internship";
import * as fsPromises from "fs/promises";
import { UploadedFile } from "express-fileupload";
import puppeteer from "puppeteer-core/lib/cjs/puppeteer/node-puppeteer-core";
import { Browser } from "puppeteer-core/lib/cjs/puppeteer/common/Browser";

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

let browser: Browser | null = null;

/**
 * Renders the given HTML content string as a PDF file
 * @param htmlContent The HTML content for the PDF file
 */
export async function buildPDFFile(htmlContent: string): Promise<Buffer> {
  if (browser === null)
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox"],
    });

  const page = await browser.newPage();
  await page.setContent(htmlContent);

  const pdf = await page.pdf({
    format: "a4",
    margin: { top: "1.5cm", bottom: "1.5cm", left: "2cm", right: "1.5cm" },
  });
  await page.close();
  return pdf;
}

/**
 * Closes the chromium instance used by puppeteer to render HTML to PDF files
 */
export async function closePDFRenderer(): Promise<void> {
  if (browser !== null && browser.isConnected()) await browser.close();
}

/**
 * Loads an HTML file template and replaces the placeholders with the user's actual data.
 * @param fileName The file to load the template from
 * @param user The user to use for filling in the data
 * @param internship The internship to use for filling in the data
 * @returns string The generated HTML template
 */
export async function buildHtmlTemplate(
  fileName: string,
  user: LeanDocument<IUser>,
  internship: LeanDocument<IInternship>
): Promise<string> {
  const dateFormatter = new Intl.DateTimeFormat("de", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const contentHtml = await fsPromises.readFile(`${process.cwd()}/pdf-templates/${fileName}`);
  const html = contentHtml.toString();
  return html
    .replace("{{semester}}", user.studentProfile?.internship.inSemester ?? "")
    .replace("{{studentId}}", user.studentProfile?.studentId.replace("s0", "") ?? "")
    .replace("{{firstName}}", user.firstName ?? "")
    .replace("{{lastName}}", user.lastName ?? "")
    .replace("{{emailAddress}}", user.emailAddress ?? "")
    .replace("{{company}}", internship.company.companyName ?? "")
    .replace(
      "{{street}}",
      `${internship.company.address.street ?? ""} ${internship.company.address.streetNumber ?? ""}`
    )
    .replace("{{zipCode}}", internship.company.address.zip ?? "")
    .replace("{{city}}", internship.company.address.city ?? "")
    .replace("{{country}}", internship.company.address.country ?? "")
    .replace("{{supervisor}}", internship.supervisor?.fullName ?? "")
    .replace("{{supervisor.emailAddress}}", internship.supervisor?.emailAddress ?? "")
    .replace(
      "{{startDate}}",
      internship.startDate ? dateFormatter.format(internship.startDate) : ""
    )
    .replace("{{endDate}}", internship.endDate ? dateFormatter.format(internship.endDate) : "")
    .replace("{{semesterOfStudy}}", user.studentProfile?.internship.inSemesterOfStudy ?? "")
    .replace("{{operationalArea}}", internship.operationalArea ?? "")
    .replace("{{tasks}}", internship.tasks ?? "")
    .replace("{{programmingLanguages}}", internship.programmingLanguages?.join(", ") ?? "");
}
