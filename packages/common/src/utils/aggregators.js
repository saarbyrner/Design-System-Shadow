// @flow
import _round from 'lodash/round';

export const calculateSumOfValues = (values: Array<number>) => {
  return values.reduce((a, b) => a + b, 0);
};

export const calculateMeanOfValues = (values: Array<number>) => {
  const sumOfValues = calculateSumOfValues(values);
  return values.length < 1 ? 0 : sumOfValues / values.length;
};

export const calculateMinValue = (values: Array<number>) => {
  return values.length < 1
    ? 0
    : values.reduce((a, b) => (a < b ? a : b), values[0]);
};

export const calculateMaxValue = (values: Array<number>) => {
  return values.length < 1
    ? 0
    : values.reduce((a, b) => (a > b ? a : b), values[0]);
};

export const returnLastValue = (values: Array<number>) => {
  return values.length < 1 ? 0 : values[values.length - 1];
};

/**
 * Filters the values with zero denominators, calculates mean of the
 * decimals and returns the mean percentage rounded by 2 digits.
 * @param {*} values Array<{ numerator: number, denominator: number }>
 * @returns number
 */
export const meanPercentageValue = (values: Array<Object>) => {
  const filteredValues = values.filter((v) => v.denominator !== 0);
  const decimalSum = filteredValues.reduce(
    (acc, item) => acc + item.numerator / item.denominator,
    0
  );

  const mean = decimalSum ? decimalSum / filteredValues.length : 0;
  return _round(mean * 100, 2);
};
