import { Internship, InternshipStatuses, tryMarkAsOver } from "../models/internship";

export async function checkInternshipOver(): Promise<void> {
  const internships = await Internship.find({
    $gt: { endDate: Date.now() },
    status: InternshipStatuses.APPROVED,
  });
  for (const internship of internships) {
    await tryMarkAsOver(internship);
  }
}
