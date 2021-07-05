import { Document } from "mongoose";
import { IEvent } from "../models/eventModels/event";

function getValue(allEvents: IEvent[], propName: string) {
  const events = allEvents.filter((event: IEvent) => {
    return event.changes;
  });

  let recentPropValue;
  let i = -1;

  while (!recentPropValue && i >= events.length * -1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recentPropValue = events.slice(i)[0].changes[propName];
    i--;
  }
  return recentPropValue;
}

export const getRecentValueForPropSetByEvent = (propName: string, document: Document): any => {
  return getValue(document.get("events"), propName);
};

export const getRecentNotRejectedValueForPropSetByEvent = (
  propName: string,
  document: Document
): any => {
  const events = document.get("events").filter((event: IEvent) => {
    return event.accept !== false;
  });

  return getValue(events, propName);
};

export const getRecentAcceptedValueForPropSetByEvent = (
  propName: string,
  document: Document
): any => {
  const events = document.get("events").filter((event: IEvent) => {
    return event.accept === true;
  });

  return getValue(events, propName);
};
