import { isPositiveIntNumber, isIntNumber } from '..';

describe('inputValidation', () => {
  it('can validate the numericInput output is a positive number', () => {
    expect(isPositiveIntNumber('0')).toEqual(true);
    expect(isPositiveIntNumber('0', true)).toEqual(false); // Don't Allow zero
    expect(isPositiveIntNumber(0)).toEqual(true);
    expect(isPositiveIntNumber(0, true)).toEqual(false);
    expect(isPositiveIntNumber('1')).toEqual(true);
    expect(isPositiveIntNumber('+1')).toEqual(true);
    expect(isPositiveIntNumber('1 ')).toEqual(true);
    expect(isPositiveIntNumber(' 1')).toEqual(true);

    expect(isPositiveIntNumber(undefined)).toEqual(false);
    expect(isPositiveIntNumber(null)).toEqual(false);
    expect(isPositiveIntNumber('')).toEqual(false);
    expect(isPositiveIntNumber('+')).toEqual(false);
    expect(isPositiveIntNumber('-')).toEqual(false);
    expect(isPositiveIntNumber('-1')).toEqual(false);
    expect(isPositiveIntNumber('0.0')).toEqual(false);
    expect(isPositiveIntNumber('0.1')).toEqual(false);
    expect(isPositiveIntNumber('1.0')).toEqual(false);
    expect(isPositiveIntNumber('1.1')).toEqual(false);
    expect(isPositiveIntNumber('-1.0')).toEqual(false);
    expect(isPositiveIntNumber('-1.1')).toEqual(false);
  });

  it('can validate the numericInput output is a number without a decimal', () => {
    expect(isIntNumber('0')).toEqual(true);
    expect(isIntNumber('1')).toEqual(true);
    expect(isIntNumber('+1')).toEqual(true);
    expect(isIntNumber('-1')).toEqual(true);

    expect(isIntNumber(undefined)).toEqual(false);
    expect(isIntNumber(null)).toEqual(false);
    expect(isIntNumber('')).toEqual(false);
    expect(isIntNumber('+')).toEqual(false);
    expect(isIntNumber('-')).toEqual(false);
    expect(isIntNumber('0.0')).toEqual(false);
    expect(isIntNumber('0.1')).toEqual(false);
    expect(isIntNumber('1.0')).toEqual(false);
    expect(isIntNumber('1.1')).toEqual(false);
    expect(isIntNumber('-1.0')).toEqual(false);
    expect(isIntNumber('-1.1')).toEqual(false);
  });
});
