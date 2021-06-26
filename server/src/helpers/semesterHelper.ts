// todo : complete!
// https://github.com/imimap/imimap/blob/master/app/models/semester_helper.rb
// https://github.com/imimap/imimap/blob/master/app/models/semester.rb
const WINTER_SEMESTER = "WS";
const SUMMER_SEMESTER = "SS";

export function getUpcomingSemester(): string {
  const date = new Date();
  // Check if it's the 31st of March
  // In this case, only add 5 months to prevent skipping a semester
  if (date.getMonth() === 2 && date.getDay() === 31) date.setMonth(date.getMonth() + 5);
  else date.setMonth(date.getMonth() + 6);

  return dateToSemester(date);
}

export function dateToSemester(date: Date): string {
  const yearModifier = date.getMonth() < 3 ? -1 : 1;
  return dateToSemesterType(date) + (date.getFullYear() + yearModifier);
}

function dateToSemesterType(date: Date): string {
  if (date.getMonth() < 3 || date.getMonth() >= 9) return WINTER_SEMESTER;
  return SUMMER_SEMESTER;
}
