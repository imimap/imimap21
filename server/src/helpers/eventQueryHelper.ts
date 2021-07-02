import { Document } from "mongoose";
import { IInternshipModuleScheduleEvent } from "../models/eventModels/internshipModuleScheduleEvent";

export const getRecentValueForPropSetByEvent = (propName: string, document: Document): unknown => {
  let recentPropValue;
  let i = -1; // counter starts with last element in events array

  const events = document.get("events");
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].get(propName);
    i--;
  }
  return recentPropValue;
};

export const getRecentNotRejectedValueForPropSetByEvent = (
  //todo: this only works for internship scheduling events
  propName: string,
  document: Document
): unknown => {
  let recentPropValue;
  let i = -1;

  const events = document.get("events").filter((event: IInternshipModuleScheduleEvent) => {
    return event.accept !== false;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0][propName];
    i--;
  }
  return recentPropValue;
};

export const getRecentAcceptedValueForPropSetByEvent = (
  //todo: this only works for internship scheduling events
  propName: string,
  document: Document
): unknown => {
  let recentPropValue;
  let i = -1;

  const events = document.get("events").filter((event: IInternshipModuleScheduleEvent) => {
    return event.accept === true;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0][propName];
    i--;
  }
  return recentPropValue;
};
