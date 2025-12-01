// @flow

export const isIntNumber = (value: ?string | ?number): boolean => {
  if (typeof value !== 'number') {
    if (
      value == null ||
      Number.isNaN(value) ||
      Number.isNaN(parseInt(value, 10)) ||
      value?.includes('.')
    ) {
      return false;
    }
  }

  if (Number.isNaN(value)) {
    return false;
  }

  return Number.isInteger(Number(value));
};

export const isPositiveIntNumber = (
  value: ?string | ?number,
  excludeZero: boolean = false
): boolean => {
  if ((!value && !['0', 0].includes(value)) || !isIntNumber(value)) {
    return false;
  }

  const number = Number(value);
  return excludeZero ? number > 0 : number >= 0;
};
