export const convertStringToArray = (string: string): string[] => string.split(', ').map((subStr) => subStr);

export const capitalizeFirstLetter = (string: string): string => {
  const firstChar = string.charAt(0).toUpperCase();
  const remainingChars = string.slice(1);
  return `${firstChar}${remainingChars}`;
};
