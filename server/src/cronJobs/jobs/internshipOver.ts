import { Internship, InternshipStatuses, tryMarkAsOver } from "../../models/internship";
import database from "../../database";
import { parentPort } from "worker_threads";

(async () => {
  await database.connect();

  const internships = await Internship.find({
    endDate: { $lte: new Date() },
    status: InternshipStatuses.APPROVED,
  });
  for (const internship of internships) {
    parentPort?.postMessage(`trying to mark internship ${internship._id} as over`);
    await tryMarkAsOver(internship);
  }

  await database.disconnect();
})();
