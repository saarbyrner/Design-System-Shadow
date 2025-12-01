import {
  getSummaryValueChartDomain,
  getStackedValueChartDomain,
  getGroupedValueChartDomain,
  scaleValue,
} from '../multiSeriesUtils';

describe('analysis XYChart | mutliSeriesUtils', () => {
  const valueAccessor = (item) =>
    item.value !== null ? parseInt(item.value, 10) : null;

  describe('getSummaryValueChartDomain', () => {
    it('returns the domain of the summary chart data', () => {
      const data = [
        { label: 'label 1', value: '100' },
        { label: 'label 2', value: '200' },
        { label: 'label 3', value: null },
      ];

      expect(getSummaryValueChartDomain(data, valueAccessor)).toStrictEqual([
        100, 200,
      ]);
    });

    it('returns the domain of the summary chart data with negative values', () => {
      const data = [
        { label: 'label 1', value: '100' },
        { label: 'label 2', value: '-200' },
        { label: 'label 3', value: null },
      ];

      expect(getSummaryValueChartDomain(data, valueAccessor)).toStrictEqual([
        -200, 100,
      ]);
    });
  });

  describe('getStackedValueChartDomain', () => {
    it('returns the domain of the stacked chart data', () => {
      const data = [
        {
          label: 'group 1',
          values: [
            { label: 'label 1', value: '100' },
            { label: 'label 2', value: null },
          ],
        },
        {
          label: 'group 2',
          values: [
            { label: 'label 3', value: '300' },
            { label: 'label 1', value: '200' },
          ],
        },
      ];

      expect(getStackedValueChartDomain(data, valueAccessor)).toStrictEqual([
        100, 500,
      ]);
    });

    it('returns the domain of the stacked chart data with negative values', () => {
      const data = [
        {
          label: 'group 1',
          values: [
            { label: 'label 1', value: '-100' },
            { label: 'label 2', value: null },
          ],
        },
        {
          label: 'group 2',
          values: [
            { label: 'label 3', value: '300' },
            { label: 'label 1', value: '200' },
          ],
        },
      ];

      expect(getStackedValueChartDomain(data, valueAccessor)).toStrictEqual([
        -100, 500,
      ]);
    });
  });

  describe('getGroupedValueChartDomain', () => {
    it('returns the domain of the grouped chart data', () => {
      const data = [
        {
          label: 'group 1',
          values: [
            { label: 'label 1', value: '100' },
            { label: 'label 2', value: null },
          ],
        },
        {
          label: 'group 2',
          values: [
            { label: 'label 3', value: '300' },
            { label: 'label 1', value: '200' },
          ],
        },
      ];

      expect(getGroupedValueChartDomain(data, valueAccessor)).toStrictEqual([
        100, 300,
      ]);
    });

    it('returns the domain of the grouped chart data with negative values', () => {
      const data = [
        {
          label: 'group 1',
          values: [
            { label: 'label 1', value: '100' },
            { label: 'label 2', value: null },
          ],
        },
        {
          label: 'group 2',
          values: [
            { label: 'label 3', value: '300' },
            { label: 'label 1', value: '-200' },
          ],
        },
      ];

      expect(getGroupedValueChartDomain(data, valueAccessor)).toStrictEqual([
        -200, 300,
      ]);
    });
  });

  describe('scaleValue', () => {
    it('returns value when fromRange is undefined', () => {
      expect(scaleValue(5, undefined, [0, 100])).toBe(5);
    });

    it('returns value when toRange is undefined', () => {
      expect(scaleValue(5, [0, 100], undefined)).toBe(5);
    });

    it('scales a number correctly', () => {
      expect(scaleValue(5, [0, 10], [0, 100])).toBe(50);

      expect(scaleValue(5, [0, 100], [0, 10])).toBe(0.5);

      expect(scaleValue(-50, [-100, 0], [0, 10])).toBe(5);
    });
  });
});
