import { renderHook } from '@testing-library/react-hooks';
import useChartContext from '../useChartContext';
import useMultiSeriesScale from '../useMultiSeriesScale';

jest.mock('../useChartContext');

describe('analysis XYChart hooks | useMultiSeriesScale', () => {
  const MOCK_CONTEXT = {
    series: {
      123: {
        valueAccessor: ({ value }) => value,
        categoryAccessor: ({ label }) => label,
        axisConfig: 'left',
        type: 'line',
        isGrouped: true,
        data: [
          {
            label: 'Group 1',
            values: [
              {
                label: 'Label 1',
                value: 60,
              },
            ],
          },
          {
            label: 'Group 2',
            values: [
              {
                label: 'Label 2',
                value: 100,
              },
            ],
          },
        ],
        dataType: 'category',
      },
      246: {
        valueAccessor: ({ value }) => value,
        categoryAccessor: ({ anotherKey }) => anotherKey,
        axisConfig: 'right',
        isGrouped: false,
        data: [
          {
            label: 'Label 3',
            value: 50,
          },
        ],
        dataType: 'category',
      },
    },
  };
  beforeEach(() => {
    useChartContext.mockReturnValue(MOCK_CONTEXT);
  });

  describe('calculating chart ranges', () => {
    it('returns the correct ranges for summary and grouped data', () => {
      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [0, 100], // grouped - series 123
        right: [0, 50], // summary - series 246
      });
    });

    it('returns the correct ranges for stacked data', () => {
      const MOCK_CONTEXT_STACKED = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            type: 'bar',
            isGrouped: true,
            renderAs: 'stack',
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label 1',
                    value: 60,
                  },
                  {
                    label: 'Label 1',
                    value: 60,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label 2',
                    value: 100,
                  },
                ],
              },
            ],
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_STACKED);
      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [0, 120], // stacked - 60 + 60
      });
    });

    it('returns the correct ranges when range goes below zero', () => {
      const MOCK_CONTEXT_WITH_MINUS = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label 1',
                    value: -10,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label 2',
                    value: 10,
                  },
                ],
              },
            ],
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            data: [
              {
                label: 'Label 3',
                value: -1.1,
              },
              {
                label: 'Label 3',
                value: -0.5,
              },
              {
                label: 'Label 3',
                value: 2.5,
              },
            ],
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_MINUS);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [-10, 10], // grouped - series 123
        right: [-1.1, 2.5], // summary - series 246
      });
    });

    it('returns the correct ranges for multiple series on left axis', () => {
      const MOCK_CONTEXT_MULTIPLE_LEFT = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            axisConfig: 'left',
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label 1',
                    value: 60,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label 2',
                    value: 100,
                  },
                ],
              },
            ],
          },
          789: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'bar',
            isGrouped: false,
            data: [
              {
                label: 'Label 3',
                value: 150,
              },
              {
                label: 'Label 4',
                value: 25,
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_MULTIPLE_LEFT);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [0, 150], // combined range from both series - min(0, 0) = 0, max(100, 150) = 150
      });
    });

    it('returns the correct ranges for multiple series on right axis', () => {
      const MOCK_CONTEXT_MULTIPLE_RIGHT = {
        series: {
          246: {
            ...MOCK_CONTEXT.series['246'],
            axisConfig: 'right',
            data: [
              {
                label: 'Label 3',
                value: 50,
              },
            ],
          },
          357: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'right',
            type: 'line',
            isGrouped: false,
            data: [
              {
                label: 'Label 5',
                value: 75,
              },
              {
                label: 'Label 6',
                value: 10,
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_MULTIPLE_RIGHT);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        right: [0, 75], // combined range from both series - min(0, 0) = 0, max(50, 75) = 75
      });
    });

    it('returns the correct ranges for multiple series with negative values', () => {
      const MOCK_CONTEXT_MULTIPLE_NEGATIVE = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            axisConfig: 'left',
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label 1',
                    value: -20,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label 2',
                    value: 50,
                  },
                ],
              },
            ],
          },
          789: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'bar',
            isGrouped: false,
            data: [
              {
                label: 'Label 3',
                value: -50,
              },
              {
                label: 'Label 4',
                value: 25,
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_MULTIPLE_NEGATIVE);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [-50, 50], // combined range - min(-20, -50) = -50, max(50, 25) = 50
      });
    });

    it('returns the correct ranges for multiple grouped series on same axis', () => {
      const MOCK_CONTEXT_MULTIPLE_GROUPED = {
        series: {
          123: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'bar',
            isGrouped: true,
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label A',
                    value: 30,
                  },
                  {
                    label: 'Label B',
                    value: 80,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label A',
                    value: 45,
                  },
                  {
                    label: 'Label B',
                    value: 120,
                  },
                ],
              },
            ],
            dataType: 'category',
          },
          456: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'line',
            isGrouped: true,
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Label C',
                    value: 200,
                  },
                  {
                    label: 'Label D',
                    value: 15,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Label C',
                    value: 90,
                  },
                  {
                    label: 'Label D',
                    value: 5,
                  },
                ],
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_MULTIPLE_GROUPED);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [0, 200], // grouped range - series 123 max is 120, series 456 max is 200
      });
    });

    it('returns the correct ranges for grouped series with mixed positive and negative values', () => {
      const MOCK_CONTEXT_GROUPED_MIXED = {
        series: {
          123: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'right',
            type: 'bar',
            isGrouped: true,
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Series A',
                    value: -30,
                  },
                  {
                    label: 'Series B',
                    value: 80,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Series A',
                    value: -60,
                  },
                  {
                    label: 'Series B',
                    value: 120,
                  },
                ],
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_GROUPED_MIXED);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        right: [-60, 120], // grouped range with negative values - min is -60, max is 120
      });
    });

    it('returns the correct ranges for multiple stacked series on same axis', () => {
      const MOCK_CONTEXT_MULTIPLE_STACKED = {
        series: {
          123: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'bar',
            isGrouped: true,
            renderAs: 'stack',
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Series A',
                    value: 30,
                  },
                  {
                    label: 'Series B',
                    value: 40,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Series A',
                    value: 50,
                  },
                  {
                    label: 'Series B',
                    value: 80,
                  },
                ],
              },
            ],
            dataType: 'category',
          },
          456: {
            valueAccessor: ({ value }) => value,
            categoryAccessor: ({ label }) => label,
            axisConfig: 'left',
            type: 'area',
            isGrouped: true,
            renderAs: 'stack',
            data: [
              {
                label: 'Group 1',
                values: [
                  {
                    label: 'Series C',
                    value: 20,
                  },
                  {
                    label: 'Series D',
                    value: 60,
                  },
                ],
              },
              {
                label: 'Group 2',
                values: [
                  {
                    label: 'Series C',
                    value: 100,
                  },
                  {
                    label: 'Series D',
                    value: 90,
                  },
                ],
              },
            ],
            dataType: 'category',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_MULTIPLE_STACKED);

      const { result } = renderHook(() => useMultiSeriesScale());

      expect(result.current.ranges).toStrictEqual({
        left: [0, 190], // stacked range - series 123: max stack 130 (50+80), series 456: max stack 190 (100+90)
      });
    });
  });

  describe('convertValueToSecondaryAxis', () => {
    it('returns the correct value for left axis series when primary axis is left', () => {
      const MOCK_CONTEXT_WITH_PRIMARY = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            primaryAxis: 'left',
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            primaryAxis: 'right',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_PRIMARY);

      const { result } = renderHook(() => useMultiSeriesScale());
      const convertValueToSecondaryAxisFunction =
        result.current.convertValueToSecondaryAxis;

      // For left axis series with primary axis left, should return original value
      const convertedValueNumber = convertValueToSecondaryAxisFunction(
        '123',
        100
      );
      const convertedValueString = convertValueToSecondaryAxisFunction(
        '123',
        '100'
      );
      const convertedValueNull = convertValueToSecondaryAxisFunction(
        '123',
        null
      );

      expect(convertedValueNumber).toBe(100);
      expect(convertedValueString).toBe('100');
      expect(convertedValueNull).toBe(null);
    });

    it('returns the correct value for right axis series when primary axis is right', () => {
      const MOCK_CONTEXT_WITH_PRIMARY = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            primaryAxis: 'left',
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            primaryAxis: 'right',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_PRIMARY);

      const { result } = renderHook(() => useMultiSeriesScale());
      const convertValueToSecondaryAxisFunction =
        result.current.convertValueToSecondaryAxis;

      // For right axis series with primary axis right, should return original value
      const convertedValueNumber = convertValueToSecondaryAxisFunction(
        '246',
        50
      );
      const convertedValueString = convertValueToSecondaryAxisFunction(
        '246',
        '50'
      );
      const convertedValueNull = convertValueToSecondaryAxisFunction(
        '246',
        null
      );

      expect(convertedValueNumber).toBe(50);
      expect(convertedValueString).toBe('50');
      expect(convertedValueNull).toBe(null);
    });

    it('returns the correct value for left axis series when primary axis is right', () => {
      const MOCK_CONTEXT_WITH_PRIMARY = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            primaryAxis: 'right',
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            primaryAxis: 'right',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_PRIMARY);

      const { result } = renderHook(() => useMultiSeriesScale());
      const convertValueToSecondaryAxisFunction =
        result.current.convertValueToSecondaryAxis;

      // For left axis series with primary axis right, should scale value
      // primaryRange = ranges.right = [0, 50], secondaryRange = ranges.left = [0, 100]
      // scaling 50 from secondaryRange [0, 100] to primaryRange [0, 50] gives 25
      const convertedValueNumber = convertValueToSecondaryAxisFunction(
        '123',
        50
      );
      const convertedValueString = convertValueToSecondaryAxisFunction(
        '123',
        '50'
      );
      const convertedValueNull = convertValueToSecondaryAxisFunction(
        '123',
        null
      );

      expect(convertedValueNumber).toBe(25);
      expect(convertedValueString).toBe(25);
      expect(convertedValueNull).toBe(null);
    });

    it('returns the correct value for right axis series when primary axis is left', () => {
      const MOCK_CONTEXT_WITH_PRIMARY = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            primaryAxis: 'left',
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            primaryAxis: 'left',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_PRIMARY);

      const { result } = renderHook(() => useMultiSeriesScale());
      const convertValueToSecondaryAxisFunction =
        result.current.convertValueToSecondaryAxis;

      // For right axis series with primary axis left, should scale value
      // primaryRange = ranges.left = [0, 100], secondaryRange = ranges.right = [0, 50]
      // scaling 100 from secondaryRange [0, 50] to primaryRange [0, 100] gives 200
      const convertedValueNumber = convertValueToSecondaryAxisFunction(
        '246',
        100
      );
      const convertedValueString = convertValueToSecondaryAxisFunction(
        '246',
        '100'
      );
      const convertedValueNull = convertValueToSecondaryAxisFunction(
        '246',
        null
      );

      expect(convertedValueNumber).toBe(200);
      expect(convertedValueString).toBe(200);
      expect(convertedValueNull).toBe(null);
    });
  });

  describe('convertValueWithRanges', () => {
    it('returns the correct value for the given primaryRange and secondaryRange', () => {
      const MOCK_CONTEXT_WITH_PRIMARY = {
        series: {
          123: {
            ...MOCK_CONTEXT.series['123'],
            primaryAxis: 'left',
          },
          246: {
            ...MOCK_CONTEXT.series['246'],
            primaryAxis: 'right',
          },
        },
      };
      useChartContext.mockReturnValue(MOCK_CONTEXT_WITH_PRIMARY);

      const { result } = renderHook(() => useMultiSeriesScale());
      const convertValueWithRangesFunction =
        result.current.convertValueWithRanges;

      const convertedValueNumber = convertValueWithRangesFunction(
        20,
        [0, 100],
        [0, 200]
      );
      const convertedValueString = convertValueWithRangesFunction(
        '20',
        [0, 100],
        [0, 200]
      );
      const convertedValueNull = convertValueWithRangesFunction(
        null,
        [0, 100],
        [0, 200]
      );

      expect(convertedValueNumber).toBe(10);
      expect(convertedValueString).toBe(10);
      expect(convertedValueNull).toBe(null);
    });
  });
});
