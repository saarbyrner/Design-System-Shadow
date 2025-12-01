import {
  calculateSumOfValues,
  calculateMeanOfValues,
  calculateMinValue,
  calculateMaxValue,
  returnLastValue,
  meanPercentageValue,
} from '../aggregators';

describe('aggregator tests', () => {
  describe('calculateSumOfValues', () => {
    it('returns the sum of positive values', () => {
      expect(calculateSumOfValues([2, 1, 5])).toEqual(8);
    });

    it('returns the sum of negative values', () => {
      expect(calculateSumOfValues([-2, -1, -5])).toEqual(-8);
    });

    it('returns the sum of mixed values', () => {
      expect(calculateSumOfValues([-2, 1, 5])).toEqual(4);
    });

    it('returns 0 when provided an empty array', () => {
      expect(calculateSumOfValues([])).toEqual(0);
    });
  });

  describe('calculateMeanOfValues', () => {
    it('returns the mean of the positive values', () => {
      expect(calculateMeanOfValues([1, 5, 3])).toEqual(3);
      expect(calculateMeanOfValues([1, 5, 2, 0])).toEqual(2);
    });

    it('returns the mean of the negative values', () => {
      expect(calculateMeanOfValues([-1, -5, -3])).toEqual(-3);
    });

    it('returns 0 when provided an empty array', () => {
      expect(calculateMeanOfValues([])).toEqual(0);
    });

    it('returns 0 when handling 0s', () => {
      expect(calculateMeanOfValues([0])).toEqual(0);
    });
  });

  describe('calculateMinValue', () => {
    it('returns the smallest of the positive values', () => {
      expect(calculateMinValue([1, 5, 0])).toEqual(0);
      expect(calculateMinValue([1, 5, 1])).toEqual(1);
    });

    it('returns the smallest of the negative values', () => {
      expect(calculateMinValue([-1, -5, 0])).toEqual(-5);
    });

    it('returns 0 when provided an empty array', () => {
      expect(calculateMinValue([])).toEqual(0);
    });
  });

  describe('calculateMaxValue', () => {
    it('returns the biggest of the positive values', () => {
      expect(calculateMaxValue([1, 5, 0])).toEqual(5);
      expect(calculateMaxValue([1, 5, 5])).toEqual(5);
    });

    it('returns the biggest of the negative values', () => {
      expect(calculateMaxValue([-1, -5, 0])).toEqual(0);
      expect(calculateMaxValue([-1, -5, -5])).toEqual(-1);
    });

    it('returns 0 when provided an empty array', () => {
      expect(calculateMaxValue([])).toEqual(0);
    });
  });

  describe('returnLastValue', () => {
    it('returns the last item of the values', () => {
      expect(returnLastValue([1, 2, 5, 10])).toEqual(10);
    });

    it('returns 0 when provided an empty array', () => {
      expect(returnLastValue([])).toEqual(0);
    });
  });

  describe('meanPercentageValue', () => {
    it('returns mean percentage value', () => {
      expect(
        meanPercentageValue([
          {
            numerator: 70,
            denominator: 77,
          },
          {
            numerator: 70,
            denominator: 77,
          },
        ])
      ).toEqual(90.91);
    });

    it('handles zero denominators and excludes the dataset from calculation', () => {
      expect(
        meanPercentageValue([
          {
            numerator: 70,
            denominator: 77,
          },
          {
            numerator: 60,
            denominator: 77,
          },
          {
            numerator: 50,
            denominator: 0,
          },
        ])
      ).toEqual(84.42);
    });

    it('handles zero numerators and includes the dataset in calculation', () => {
      expect(
        meanPercentageValue([
          {
            numerator: 70,
            denominator: 77,
          },
          {
            numerator: 60,
            denominator: 77,
          },
          {
            numerator: 0,
            denominator: 77,
          },
        ])
      ).toEqual(56.28);
    });

    it('returns 0 when provided an empty array', () => {
      expect(meanPercentageValue([])).toEqual(0);
    });
  });
});
