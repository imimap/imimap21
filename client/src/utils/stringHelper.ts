export const convertStringToArray = (string: string): string[] => string.split(', ').map((subStr) => subStr);

export const capitalizeFirstLetter = (string: string): string => {
  const firstChar = string.charAt(0).toUpperCase();
  const remainingChars = string.slice(1);
  return `${firstChar}${remainingChars}`;
};
export const formatTimeout = (t: number): string => {
  const min = Math.floor(t / 60000);
  const sec = (t % 60000) / 1000;
  return `${min}:${sec}`;
};

declare global {
  interface String {
    capitalize(): string;
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function capitalize() {
  return capitalizeFirstLetter(this as string);
};
