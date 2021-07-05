import { Document } from "mongoose";
import { IEvent } from "../models/eventModels/event";
import { IInternshipModuleScheduleEvent } from "../models/eventModels/internshipModuleScheduleEvent";

export const getRecentValueForPropSetByEvent = (propName: string, document: Document): any => {
  let recentPropValue;
  let i = -1; // counter starts with last element in events array

  const events = document.get("events");
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].changes.get(propName);
    i--;
  }
  return recentPropValue;
};

export const getRecentNotRejectedValueForPropSetByEvent = (
  propName: string,
  document: Document
): any => {
  let recentPropValue;
  let i = -1;

  const events = document.get("events").filter((event: IEvent) => {
    return event.changes?.accept !== false;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].changes[propName];
    i--;
  }
  return recentPropValue;
};

export const getRecentAcceptedValueForPropSetByEvent = (
  propName: string,
  document: Document
): any => {
  let recentPropValue;
  let i = -1;

  const events = document.get("events").filter((event: IEvent) => {
    return event.changes?.accept === true;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].changes[propName];
    i--;
  }
  return recentPropValue;
};
