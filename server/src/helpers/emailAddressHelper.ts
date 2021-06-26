import validator from "validator";

export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};
