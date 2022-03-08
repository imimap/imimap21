import Internship from '@/models/Internship';
import { isProxy, toRaw } from 'vue';

export const getDateString = (ISODateString: string): string => {
  const date = new Date(ISODateString);
  return date.toLocaleDateString();
};

export const getTimeDifferenceDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
};

export const getInternshipModuleDuration = (internships: Internship[]): string => {
  let durationSumInDays = 0;
  internships.forEach((internship) => {
    durationSumInDays += getTimeDifferenceDays(internship.startDate, internship.endDate);
  });
  return durationSumInDays > 0
    ? `${Math.floor(durationSumInDays / 7)} Wochen, ${Math.floor(durationSumInDays) % 7} Tage`
    : '-';
};

export const jsDateToHTMLDate = (jsDate?: string): string | undefined => jsDate?.substr(0, 10);

// It would be nice to have type safety here, but I can't seem
// to figure out how to implement this in a type-safe way right now.
// (updatableProps as supertype for data and original, see https://stackoverflow.com/a/54061487)
export const createPayloadFromChangedProps = <T>(
  updatableProps: string[],
  data: Record<string, unknown>,
  original: T,
): Record<string, unknown> => {
  const mappedProps = updatableProps.reduce((payload, prop) => {
    if (data[prop] !== undefined && data[prop] !== original[prop]) {
      payload.set(prop, isProxy(data[prop]) ? toRaw(data[prop]) : data[prop]);
    }
    return payload;
  }, new Map<string, unknown>());
  return Object.fromEntries(mappedProps);
};
