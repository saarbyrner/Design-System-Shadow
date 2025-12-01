// eslint-disable-next-line jest/no-mocks-import
import { MOCK_CHART_ELEMENTS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { CHART_BACKGROUND_ZONE_CONDITIONS } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel/constants';
import {
  getChartValue,
  getValueFormat,
  sortChartElementIndexes,
  sortChartElements,
  sortChartDataByChartElements,
  isChartDataEmpty,
  getDefaultAxisLabel,
  sortMicroCyclesData,
  getDefaultSortFunctionByGrouping,
  handleBackgroundZoneRanges,
  getFormattingRuleByType,
} from '../utils';

describe('analysis dashboard | Chart | utils', () => {
  describe('getChartValue', () => {
    it('returns null when the value is null', () => {
      const result = getChartValue(null);
      expect(result).toBe(null);
    });

    it('returns the number when the value is a number', () => {
      const result = getChartValue(7);
      expect(result).toBe(7);
    });

    it('returns the correct number when the value is a string', () => {
      const result = getChartValue('3');
      expect(result).toBe(3);
    });

    it('returns the correct number when the calculation is percentage', () => {
      const result = getChartValue(
        { numerator: 1, denominator: 2 },
        'percentage'
      );
      expect(result).toBe(50);
    });

    it('returns the correct number when the calculation is percentage_duration', () => {
      const result = getChartValue(
        { numerator: 1, denominator: 2 },
        'percentage_duration'
      );
      expect(result).toBe(50);
    });

    it('returns the correct number when the calculation is count', () => {
      const result = getChartValue({ numerator: 1, denominator: 2 }, 'count');
      expect(result).toBe(1);
    });
  });

  describe('getValueFormat', () => {
    it('returns empty string when the value is null', () => {
      const result = getValueFormat(null);
      expect(result).toBe('');
    });

    it('returns the percent sign with the value when the calculation is percentage', () => {
      const result = getValueFormat(50, 'percentage', true);
      expect(result).toBe('50%');
    });

    it('returns the percent sign with the value when the calculation is percentage_duration', () => {
      const result = getValueFormat(50, 'percentage_duration', true);
      expect(result).toBe('50%');
    });

    it('returns a string for all other values', () => {
      const result = getValueFormat(50);
      expect(result).toBe('50');
    });

    it('returns the rounded value when roundingPlaces is provided', () => {
      const result = getValueFormat(50, 'mean', false, 3);
      expect(result).toBe((50).toFixed(3));
    });

    it('returns the original value when roundingPlaces is not provided', () => {
      const result = getValueFormat(50, 'mean', false);
      expect(result).toBe('50');
    });

    it('returns the expected rounded value with decorator', () => {
      const result = getValueFormat(50, 'percentage', true, 2);
      expect(result).toBe(`${(50).toFixed(2)}%`);
    });
  });

  describe('sortChartElementIndexes', () => {
    it('returns an empty array when chartElements is not defined', () => {
      expect(sortChartElementIndexes(undefined)).toStrictEqual([]);
    });

    it('returns an unsorted array of indexes when no bar series are present', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(sortChartElementIndexes(unsortedElements)).toStrictEqual([0, 1]);
    });

    it('returns an unsorted array of indexes when bar series is first', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(sortChartElementIndexes(unsortedElements)).toStrictEqual([0, 1]);
    });

    it('returns a sorted array of indexes when bar series is second', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
      ];

      expect(sortChartElementIndexes(unsortedElements)).toStrictEqual([1, 0]);
    });
  });

  describe('sortChartElements', () => {
    it('returns an empty array when chartElements is not defined', () => {
      expect(sortChartElements(undefined)).toStrictEqual([]);
      expect(sortChartElements([])).toStrictEqual([]);
    });

    it('returns an unsorted array of elements when no bar series are present', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(sortChartElements(unsortedElements)).toStrictEqual(
        unsortedElements
      );
    });

    it('returns an unsorted array of elements when bar series is first', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(sortChartElements(unsortedElements)).toStrictEqual(
        unsortedElements
      );
    });

    it('returns a sorted array of elements when bar series is second', () => {
      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
      ];

      expect(sortChartElements(unsortedElements)).toStrictEqual([
        unsortedElements[1],
        unsortedElements[0],
      ]);
    });
  });

  describe('sortChartDataByChartElements', () => {
    it('returns an empty array when chartData is undefined', () => {
      expect(sortChartDataByChartElements(undefined, undefined)).toStrictEqual(
        []
      );
      expect(sortChartDataByChartElements([], [])).toStrictEqual([]);
    });

    it('returns an unsorted array of chartData when no bar series are present in chartElements', () => {
      const unsortedData = [
        {
          id: '123',
          chart: {
            label: 'line series label',
            value: 50,
          },
        },
        {
          id: '123',
          chart: {
            label: 'line series label',
            value: 10,
          },
        },
      ];

      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(
        sortChartDataByChartElements(unsortedData, unsortedElements)
      ).toStrictEqual(unsortedData);
    });

    it('returns an unsorted array of chartData when bar series is first in chartElements', () => {
      const unsortedData = [
        {
          id: '123',
          chart: {
            label: 'bar series label',
            value: 50,
          },
        },
        {
          id: '123',
          chart: {
            label: 'line series label',
            value: 10,
          },
        },
      ];

      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
      ];

      expect(
        sortChartDataByChartElements(unsortedData, unsortedElements)
      ).toStrictEqual(unsortedData);
    });

    it('returns a sorted array of chartData when bar series is second in chartElements', () => {
      const unsortedData = [
        {
          id: '123',
          chart: {
            label: 'line series label',
            value: 50,
          },
        },
        {
          id: '123',
          chart: {
            label: 'bar series label',
            value: 10,
          },
        },
      ];

      const unsortedElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            render_options: {
              type: 'line',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            render_options: {
              type: 'bar',
            },
          },
        },
      ];

      expect(
        sortChartDataByChartElements(unsortedData, unsortedElements)
      ).toStrictEqual([unsortedData[1], unsortedData[0]]);
    });
  });

  describe('isChartDataEmpty', () => {
    it('returns true when no chart data is passed through', () => {
      expect(isChartDataEmpty(undefined)).toBe(true);
      expect(isChartDataEmpty([])).toBe(true);
    });

    it('returns true when chartData contains 1 element with an empty chart config', () => {
      const chartData = [{ id: '123', chart: [] }];

      expect(isChartDataEmpty(chartData)).toBe(true);
    });

    it('returns true when chartData contains more than 1 element with empty chart configs', () => {
      const chartData = [
        { id: '123', chart: [] },
        { id: '123', chart: [] },
      ];

      expect(isChartDataEmpty(chartData)).toBe(true);
    });

    it('returns false when chartData contains 1 element with chart config', () => {
      const chartData = [
        { id: '123', chart: [{ label: 'label 1', value: '50' }] },
      ];

      expect(isChartDataEmpty(chartData)).toBe(false);
    });

    it('returns false when chartData contains more than 1 element with at least 1 chart config', () => {
      const chartData = [
        { id: '123', chart: [] },
        { id: '123', chart: [{ label: 'label 1', value: '50' }] },
      ];

      expect(isChartDataEmpty(chartData)).toBe(false);
    });
  });

  describe('getDefaultAxisLabel', () => {
    it('returns a hyphenated string with datasource name and calculation', () => {
      const datasourceName = 'Age (years)';
      const calculation = 'sum_absolute';
      expect(getDefaultAxisLabel(datasourceName, calculation)).toBe(
        'Age (years)-Sum (Absolute)'
      );
    });

    it('should truncate long datasource name and calculation into hyphenated string', () => {
      const datasourceName =
        'Close contact with probable case of COVID-19? (Yes/No)';
      const calculation = 'count_absolute';
      expect(getDefaultAxisLabel(datasourceName, calculation)).toBe(
        'Close contact with pro...-Count (Absolute)'
      );
    });

    it('returns only datasource without any hyphenation if calculation is empty', () => {
      const datasourceName = 'Age (years)';
      const calculation = '';
      expect(getDefaultAxisLabel(datasourceName, calculation)).toBe(
        'Age (years)'
      );
    });

    it('returns a longer datasource string without hyphenation if calculation is empty', () => {
      const datasourceName =
        'Close contact with probable cases of COVID-19? (Yes/No)';
      const calculation = '';
      expect(getDefaultAxisLabel(datasourceName, calculation)).toBe(
        'Close contact with probable cases of COVID...'
      );
    });

    it('handles empty strings', () => {
      expect(getDefaultAxisLabel('', '')).toBe('');
    });
  });

  describe('sortMicroCyclesData', () => {
    it('sorts the microCycles data for summary chart data', () => {
      const summaryData = [
        {
          label: 'Week 2',
          value: '5.70',
        },
        {
          label: 'Week 10',
          value: '5.80',
        },
        {
          label: 'Week 8',
          value: '13.20',
        },
        {
          label: 'Week 16',
          value: '5.20',
        },
        {
          label: 'Week 1',
          value: '11.60',
        },
      ];

      const sortedData = [
        {
          label: 'Week 1',
          value: '11.60',
        },
        {
          label: 'Week 2',
          value: '5.70',
        },
        {
          label: 'Week 8',
          value: '13.20',
        },
        {
          label: 'Week 10',
          value: '5.80',
        },
        {
          label: 'Week 16',
          value: '5.20',
        },
      ];

      expect(sortMicroCyclesData(summaryData)).toStrictEqual(sortedData);
    });

    it('sorts the microCycles summary data with any non-week labels at the end', () => {
      const summaryData = [
        {
          label: 'Week 2',
          value: '5.70',
        },
        {
          label: 'Week 16',
          value: '5.20',
        },
        {
          label: 'Week 10',
          value: '5.80',
        },
        {
          label: 'Other',
          value: '13.20',
        },
        {
          label: 'Week 1',
          value: '11.60',
        },
      ];

      const sortedData = [
        {
          label: 'Week 1',
          value: '11.60',
        },
        {
          label: 'Week 2',
          value: '5.70',
        },
        {
          label: 'Week 10',
          value: '5.80',
        },
        {
          label: 'Week 16',
          value: '5.20',
        },
        {
          label: 'Other',
          value: '13.20',
        },
      ];

      expect(sortMicroCyclesData(summaryData)).toStrictEqual(sortedData);
    });

    it('sorts the microCycles data for grouped chart data', () => {
      const groupedData = [
        {
          label: 'Week 3',
          values: [
            {
              label: 'Second Row',
              value: '5.80',
            },
          ],
        },
        {
          label: 'Week 16',
          values: [
            {
              label: 'Second Row',
              value: '5.20',
            },
          ],
        },
        {
          label: 'Week 1',
          values: [
            {
              label: 'Second Row',
              value: '5.70',
            },
          ],
        },
        {
          label: 'Week 10',
          values: [
            {
              label: 'Second Row',
              value: '6.60',
            },
          ],
        },
        {
          label: 'Week 7',
          values: [
            {
              label: 'Second Row',
              value: '20.70',
            },
          ],
        },
      ];

      const sortedData = [
        {
          label: 'Week 1',
          values: [
            {
              label: 'Second Row',
              value: '5.70',
            },
          ],
        },
        {
          label: 'Week 3',
          values: [
            {
              label: 'Second Row',
              value: '5.80',
            },
          ],
        },
        {
          label: 'Week 7',
          values: [
            {
              label: 'Second Row',
              value: '20.70',
            },
          ],
        },
        {
          label: 'Week 10',
          values: [
            {
              label: 'Second Row',
              value: '6.60',
            },
          ],
        },
        {
          label: 'Week 16',
          values: [
            {
              label: 'Second Row',
              value: '5.20',
            },
          ],
        },
      ];

      expect(sortMicroCyclesData(groupedData)).toStrictEqual(sortedData);
    });

    it('sorts the microCycles grouped data with any non-week labels at the end', () => {
      const groupedData = [
        {
          label: 'Other',
          values: [
            {
              label: 'Second Row',
              value: '5.80',
            },
          ],
        },
        {
          label: 'Week 1',
          values: [
            {
              label: 'Second Row',
              value: '5.70',
            },
          ],
        },
        {
          label: 'Week 16',
          values: [
            {
              label: 'Second Row',
              value: '5.20',
            },
          ],
        },
        {
          label: 'Week 10',
          values: [
            {
              label: 'Second Row',
              value: '6.60',
            },
          ],
        },
        {
          label: 'Week 7',
          values: [
            {
              label: 'Second Row',
              value: '20.70',
            },
          ],
        },
      ];

      const sortedData = [
        {
          label: 'Week 1',
          values: [
            {
              label: 'Second Row',
              value: '5.70',
            },
          ],
        },
        {
          label: 'Week 7',
          values: [
            {
              label: 'Second Row',
              value: '20.70',
            },
          ],
        },
        {
          label: 'Week 10',
          values: [
            {
              label: 'Second Row',
              value: '6.60',
            },
          ],
        },
        {
          label: 'Week 16',
          values: [
            {
              label: 'Second Row',
              value: '5.20',
            },
          ],
        },
        {
          label: 'Other',
          values: [
            {
              label: 'Second Row',
              value: '5.80',
            },
          ],
        },
      ];

      expect(sortMicroCyclesData(groupedData)).toStrictEqual(sortedData);
    });
  });

  describe('getDefaultSortFunctionByGrouping', () => {
    it('returns the correct function for micro_cycle', () => {
      expect(getDefaultSortFunctionByGrouping('micro_cycle')).toEqual(
        sortMicroCyclesData
      );
    });

    it('returns undefined when grouping is not found', () => {
      expect(getDefaultSortFunctionByGrouping('not_a_grouping')).toEqual(
        undefined
      );
    });
  });

  describe('handleBackgroundZoneRanges', () => {
    it('returns the correct background zone for between condition', () => {
      const result = handleBackgroundZoneRanges({
        condition: CHART_BACKGROUND_ZONE_CONDITIONS.between,
        to: 10,
        from: 5,
        value: undefined,
      });
      expect(result).toEqual({ to: 10, from: 5 });
    });

    it('returns the correct background zone for less_than condition', () => {
      const result = handleBackgroundZoneRanges({
        condition: CHART_BACKGROUND_ZONE_CONDITIONS.less_than,
        to: undefined,
        from: undefined,
        value: 10,
      });
      expect(result).toEqual({ to: 10, from: undefined });
    });

    it('returns the correct background zone for greater_than condition', () => {
      const result = handleBackgroundZoneRanges({
        condition: CHART_BACKGROUND_ZONE_CONDITIONS.greater_than,
        to: undefined,
        from: undefined,
        value: 5,
      });
      expect(result).toEqual({ to: undefined, from: 5 });
    });
  });

  describe('getFormattingRuleByType', () => {
    const baseChartElement = {
      config: {
        render_options: {
          conditional_formatting: [
            { type: 'reference_line', value: 10, color: 'red' },
            {
              type: 'zone',
              condition: 'greater_than',
              value: 5,
              color: 'blue',
            },
          ],
        },
      },
    };

    it('returns only the rules that match the provided type', () => {
      const result = getFormattingRuleByType(
        baseChartElement,
        'reference_line'
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result?.[0]).toMatchObject({ type: 'reference_line', value: 10 });
    });

    it('returns an empty array when no rules match the provided type', () => {
      const result = getFormattingRuleByType(
        baseChartElement,
        'non_existent_type'
      );
      expect(result).toEqual([]);
    });

    it('returns undefined when there is no conditional_formatting config', () => {
      const result = getFormattingRuleByType(
        { config: { render_options: {} } },
        'reference_line'
      );
      expect(result).toBeUndefined();
    });
  });
});
