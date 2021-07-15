import Internship from '@/models/Internship';

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
