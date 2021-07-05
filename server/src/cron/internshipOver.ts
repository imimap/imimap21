import { Internship } from "../models/internship";

export async function checkInternshipOver(): Promise<void> {
  const internships = await Internship.find({
    $gt: { endDate: Date.now() },
  });
}
