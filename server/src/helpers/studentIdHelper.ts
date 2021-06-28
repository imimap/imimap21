export const isValidStudentId = (id: string): boolean => {
  // eslint-disable-next-line no-control-regex
  return /^s0[0-9]{6}$/.test(id);
};

export const normalizeStudentId = (id: string): string => {
  return id.trim().toLowerCase();
};
