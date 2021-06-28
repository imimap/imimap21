import { Document } from "mongoose";

export const getRecentValueForPropSetByEvent = (propName: string, document: Document): any => {
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
  propName: string,
  document: Document
): any => {
  let recentPropValue;
  let i = -1;

  const events = document.get("events");
  while (!recentPropValue && i >= events.length * -1) {
    if (document.get("status") !== "rejected") recentPropValue = events.slice(i)[0].get(propName);
    i--;
  }
  return recentPropValue;
};
