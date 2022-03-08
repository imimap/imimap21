import { LeanDocument } from "mongoose";
import { IUser } from "../models/user";
import { IInternship } from "../models/internship";
import * as fsPromises from "fs/promises";
import { UploadedFile } from "express-fileupload";

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

/**
 * Loads a HTML file template and replaces the placeholders with the user's actual data.
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
  const dateFormatter = new Intl.DateTimeFormat("de");
  const contentHtml = await fsPromises.readFile(`${process.cwd()}/pdf-templates/${fileName}`);
  const html = contentHtml.toString();
  return html
    .replace("{{semester}}", user.studentProfile?.internship.inSemester ?? "")
    .replace("{{studentId}}", user.studentProfile?.studentId ?? "")
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
