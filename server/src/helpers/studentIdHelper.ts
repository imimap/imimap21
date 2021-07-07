export const isValidStudentId = (id: string): boolean => {
  return /^s0[0-9]{6}$/.test(id);
};

export const normalizeStudentId = (id: string): string => {
  return id.trim().toLowerCase();
};

export function sanitizeUsername(username: string): string {
  const regexMatches = /^(s0[0-9]{6})(@htw-berlin\.de)?$/.exec(username);
  return regexMatches ? regexMatches[1] : "";
}
