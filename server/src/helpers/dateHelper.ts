export const normalizeDate = (date: Date): Date => {
  const res = date;
  res.setUTCHours(8);
  res.setUTCMinutes(0);
  res.setUTCSeconds(0);
  res.setUTCMilliseconds(0);
  return res;
};

const MINIMUM_INTERNSHIP_DURATION_IN_MILLISECONDS = 4 * 7 * 24 * 60 * 60 * 1000; // (w * t * h * s * ms)

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  if (!startDate) return true;
  const duration = endDate.getTime() - startDate.getTime();
  return duration >= MINIMUM_INTERNSHIP_DURATION_IN_MILLISECONDS;
};

export const getWeeksBetween = (startDate: Date, endDate: Date): number => {
  const difference = endDate.getTime() - startDate.getTime();
  return difference / 1000 / 60 / 60 / 24 / 7;
};
