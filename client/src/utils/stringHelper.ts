const convertStringToArray = (string: string): string[] => string.split(', ').map((subStr) => subStr);
export { convertStringToArray as default };
