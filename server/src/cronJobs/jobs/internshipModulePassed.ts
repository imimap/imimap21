import {
  InternshipModule,
  InternshipModuleStatuses,
  trySetPassed,
} from "../../models/internshipModule";
import database from "../../database";

(async () => {
  await database.connect();

  const internshipsModules = await InternshipModule.find({
    status: InternshipModuleStatuses.PLANNED,
    aepPassed: true,
  });
  for (const module of internshipsModules) {
    await trySetPassed(module);
  }

  await database.disconnect();
})();
