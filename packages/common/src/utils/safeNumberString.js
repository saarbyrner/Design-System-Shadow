// @flow

/**
 * This function is used to safely stringify a number or a string to a string.
 * If the value is null or undefined, it will return '0'.
 * If the value is a number, it will return the stringified number.
 * If the value is a string, it will return the string.
 * If the value is not a number or a string, it will return '0'.
 */
export const safeNumberString = (value?: string | number): string => {
  if (!value) return '0';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  return '0';
};
