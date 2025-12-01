import { renderHook } from '@testing-library/react-hooks';
import useChartContext from '../useChartContext';
import useProcessSeriesGroupData from '../useProcessSeriesGroupData';

jest.mock('../useChartContext');

describe('analysis XYChart hooks | useProcessSeriesGroupData', () => {
  const timeSeries = {
    valueAccessor: ({ value }) => value,
    categoryAccessor: ({ label }) => label,
    axisConfig: 'left',
    dataType: 'time',
    type: 'bar',
    aggregateValues: {
      aggregatePeriod: 'daily',
      aggregateMethod: 'sum',
    },
    isGrouped: true,
    data: [
      {
        label: '2024-11,05',
        values: [
          {
            label: 'Athlete 1',
            value: 60,
          },
          {
            label: 'Athlete 2',
            value: 50,
          },
        ],
      },
      {
        label: '2024-10-16',
        values: [
          {
            label: 'Athlete 2',
            value: 100,
          },
        ],
      },

      {
        label: '2024-10-19',
        values: [
          {
            label: 'Athlete 1',
            value: 50,
          },
          {
            label: 'Athlete 2',
            value: 50,
          },
        ],
      },
    ],
  };

  const categorySeries = {
    valueAccessor: ({ value }) => value,
    categoryAccessor: ({ label }) => label,
    axisConfig: 'left',
    dataType: 'category',
    type: 'line',
    isGrouped: true,
    data: [
      {
        label: 'Athlete 1',
        values: [
          { label: 'U21', value: 100 },
          { label: 'U19', value: 50 },
          { label: 'U17', value: 25 },
        ],
      },
      {
        label: 'Athlete 3',
        values: [
          { label: 'U21', value: 25 },
          { label: 'U19', value: 75 },
          { label: 'U17', value: 25 },
        ],
      },
      {
        label: 'Player 2',
        values: [
          { label: 'U21', value: 100 },
          { label: 'U19', value: 150 },
          { label: 'U17', value: 50 },
        ],
      },
    ],
  };

  describe('processing longitudinal data', () => {
    const values = [
      // athlete 2 values
      { label: '2024-10-16', value: 100 },
      { label: '2024-10-19', value: 50 },
      { label: '2024-11,05', value: 50 },
    ];

    const weeklyAggregates = [
      { label: '2024-10-14', value: 150 },
      { label: '2024-11-04', value: 50 },
    ];

    const monthlyAggregates = [
      { label: '2024-10-01', value: 150 },
      { label: '2024-11-01', value: 50 },
    ];

    it('returns the data processed for a bar chart without aggregation', () => {
      const mockProcessSeriesData = (data) => data;
      useChartContext.mockReturnValue({ series: { 123: timeSeries } });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(values);
    });

    it('returns the data processed for a line chart without aggregation', () => {
      const mockProcessSeriesData = (data) => data;
      useChartContext.mockReturnValue({
        series: { 123: { ...timeSeries, type: 'line' } },
      });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(values);
    });

    it('returns the data aggreated by week for a bar chart', () => {
      const mockProcessSeriesData = () => weeklyAggregates;
      useChartContext.mockReturnValue({
        series: {
          123: {
            ...timeSeries,
            aggregateValues: {
              aggregatePeriod: 'weekly',
              aggregateMethod: 'sum',
            },
          },
        },
      });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(weeklyAggregates);
    });

    it('returns the data aggregated by week for a line chart', () => {
      const mockProcessSeriesData = () => weeklyAggregates;
      useChartContext.mockReturnValue({
        series: {
          123: {
            ...timeSeries,
            type: 'line',
            aggregateValues: {
              aggregatePeriod: 'weekly',
              aggregateMethod: 'sum',
            },
          },
        },
      });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(weeklyAggregates);
    });

    it('returns the data aggregated by month for a bar chart', () => {
      const mockProcessSeriesData = () => monthlyAggregates;
      useChartContext.mockReturnValue({
        series: {
          123: {
            ...timeSeries,
            aggregateValues: {
              aggregatePeriod: 'monthly',
              aggregateMethod: 'sum',
            },
          },
        },
      });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(monthlyAggregates);
    });

    it('returns the data aggregated by month for a line chart', () => {
      const mockProcessSeriesData = () => monthlyAggregates;
      useChartContext.mockReturnValue({
        series: {
          123: {
            ...timeSeries,
            type: 'line',
            aggregateValues: {
              aggregatePeriod: 'monthly',
              aggregateMethod: 'sum',
            },
          },
        },
      });

      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, mockProcessSeriesData);

      expect(data).toStrictEqual(monthlyAggregates);
    });

    it('does not aggregate data when processSeriesData is undefined', () => {
      useChartContext.mockReturnValue({
        series: {
          123: timeSeries,
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, undefined);

      expect(data).toStrictEqual(values);
    });
  });

  describe('processing category data', () => {
    // U21 values
    const values = [
      {
        label: 'Athlete 1',
        value: 100,
      },
      {
        label: 'Player 2',
        value: 100,
      },
      {
        label: 'Athlete 3',
        value: 25,
      },
    ];

    it('maps the data to domain order', () => {
      useChartContext.mockReturnValue({
        series: {
          123: categorySeries,
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(values, undefined);

      const expected = [
        {
          label: 'Athlete 1',
          value: 100,
        },
        {
          label: 'Athlete 3',
          value: 25,
        },
        {
          label: 'Player 2',
          value: 100,
        },
      ];

      expect(data).toStrictEqual(expected);
    });
  });

  describe('filtering null values', () => {
    const seriesWithNulls = {
      ...categorySeries,
      type: 'line',
      data: [
        {
          label: 'Athlete 1',
          values: [
            { label: 'U21', value: 100 },
            { label: 'U19', value: null },
            { label: 'U17', value: null },
          ],
        },
        {
          label: 'Athlete 3',
          values: [
            { label: 'U21', value: null },
            { label: 'U19', value: 75 },
            { label: 'U17', value: 25 },
          ],
        },
        {
          label: 'Player 2',
          values: [
            { label: 'U21', value: null },
            { label: 'U19', value: 150 },
            { label: 'U17', value: 50 },
          ],
        },
      ],
    };
    // U19 values
    const categorySeriesValues = [
      {
        label: 'Athlete 1',
        value: null,
      },
      {
        label: 'Player 2',
        value: 75,
      },
      {
        label: 'Athlete 3',
        value: 150,
      },
    ];
    const timeSeriesWithNulls = {
      ...timeSeries,
      type: 'line',
      data: [
        {
          label: '2024-11,05',
          values: [
            {
              label: 'Athlete 1',
              value: 60,
            },
            {
              label: 'Athlete 2',
              value: 50,
            },
          ],
        },
        {
          label: '2024-10-16',
          values: [
            {
              label: 'Athlete 1',
              value: null,
            },
            {
              label: 'Athlete 2',
              value: 100,
            },
          ],
        },

        {
          label: '2024-10-19',
          values: [
            {
              label: 'Athlete 1',
              value: 50,
            },
            {
              label: 'Athlete 2',
              value: 50,
            },
          ],
        },
      ],
    };
    // athlete 1 values
    const timeSeriesValues = [
      { label: '2024-10-16', value: null },
      { label: '2024-10-19', value: 50 },
      { label: '2024-11,05', value: 60 },
    ];

    it('filters out null values for a category line series', () => {
      useChartContext.mockReturnValue({
        series: {
          123: seriesWithNulls,
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(categorySeriesValues, undefined);

      // null values filtered out, and series mapped to domain
      const expected = [
        {
          label: 'Athlete 3',
          value: 150,
        },
        {
          label: 'Player 2',
          value: 75,
        },
      ];

      expect(data).toStrictEqual(expected);
    });

    it('does not filter out null values for a category bar series', () => {
      useChartContext.mockReturnValue({
        series: {
          123: { ...seriesWithNulls, type: 'bar' },
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(categorySeriesValues, undefined);

      // series mapped to domain, but nulls not filtered out
      const expected = [
        {
          label: 'Athlete 1',
          value: null,
        },
        {
          label: 'Athlete 3',
          value: 150,
        },
        {
          label: 'Player 2',
          value: 75,
        },
      ];

      expect(data).toStrictEqual(expected);
    });

    it('filters out null values for a time line series', () => {
      useChartContext.mockReturnValue({
        series: {
          123: timeSeriesWithNulls,
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(timeSeriesValues, undefined);

      // null values filtered out, and series mapped to domain
      const expected = [
        { label: '2024-10-19', value: 50 },
        { label: '2024-11,05', value: 60 },
      ];

      expect(data).toStrictEqual(expected);
    });

    it('does not filter out null values for a time bar series', () => {
      useChartContext.mockReturnValue({
        series: {
          123: { ...timeSeriesWithNulls, type: 'bar' },
        },
      });
      const { result } = renderHook(() => useProcessSeriesGroupData('123'));

      const processData = result.current.processData;

      const data = processData(timeSeriesValues, undefined);

      expect(data).toStrictEqual(timeSeriesValues);
    });
  });
});
