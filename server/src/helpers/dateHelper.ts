export const normalizeDate = (date: Date) => {
  const res = date;
  res.setUTCHours(0);
  res.setUTCMinutes(0);
  res.setUTCSeconds(0);
  res.setMilliseconds(0);
  return res;
};

const MINIMUM_INTERNSHIP_DURATION_IN_MILLISECONDS = 4 * 7 * 24 * 60 * 60 * 1000; // (w * t * h * s * ms)

export const isValidDateRange = (startDate: Date, endDate: Date) => {
  if (!startDate) return true;
  return endDate.getTime() - startDate.getTime() < MINIMUM_INTERNSHIP_DURATION_IN_MILLISECONDS;
};
