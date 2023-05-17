import * as Bree from "bree";
import { join } from "path";

const bree = new Bree({
  root: join(__dirname, "jobs"),
  jobs: [
    {
      name: "internshipModulePassed",
      cron: "0 0 * * *",
    },
    {
      name: "internshipOver",
      cron: "0 0 * * *",
    },
  ],
  workerMessageHandler: console.log,
});

export default {
  start: bree.start,
  stop: bree.stop,
};
