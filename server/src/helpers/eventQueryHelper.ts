import { Document } from "mongoose";
import { IEvent } from "../models/eventModels/event";

export const getRecentValueForPropSetByEvent = (propName: string, document: Document): any => {
  let recentPropValue;
  let i = -1; // counter starts with last element in events array

  const events = document.get("events").filter((event: IEvent) => {
    return event.changes;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].changes[propName];
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
    return event.changes && event.accept !== false;
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
    return event.changes && event.accept === true;
  });
  while (!recentPropValue && i >= events.length * -1) {
    recentPropValue = events.slice(i)[0].changes[propName];
    i--;
  }
  return recentPropValue;
};
