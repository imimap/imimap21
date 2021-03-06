import {
  InternshipModule,
  InternshipModuleStatuses,
  trySetPassed,
} from "../models/internshipModule";

export async function checkModulePassed(): Promise<void> {
  const internshipsModules = await InternshipModule.find({
    status: InternshipModuleStatuses.PLANNED,
    aepPassed: true,
  });
  for (const module of internshipsModules) {
    await trySetPassed(module);
  }
}
