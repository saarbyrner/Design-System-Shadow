import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import DateTimeSeries from '../components/DateTimeSeries';
import { ChartContextProvider } from '../components/Context';
import useChartContext from '../hooks/useChartContext';
import { SERIES_TYPES, AGGREGATE_PERIOD, AGGREGATE_METHOD } from '../constants';

describe('analysis shared|DateTimeSeries', () => {
  const setupTest = (partialSeries = {}) => {
    const valueAccessor = ({ value }) => value;
    const categoryAccessor = ({ label }) => label;

    const series = {
      id: 123,
      data: [],
      type: SERIES_TYPES.bar,
      valueAccessor,
      categoryAccessor,
      aggregateValues: {
        aggregatePeriod: AGGREGATE_PERIOD.daily,
        aggregateMethod: AGGREGATE_METHOD.sum,
      },
      chartOptions: { hide_null_values: false, hide_zero_values: false },
      ...partialSeries,
    };

    // sets up a wrapper where the useChartContext hook is rendered in the children
    // this way we can use the result to test if the category series modifies the context
    // correctly
    const Wrapper = (props) => (
      <ChartContextProvider>
        <DateTimeSeries {...props.series} />
        {props.children}
      </ChartContextProvider>
    );

    const { result, rerender } = renderHook(() => useChartContext(), {
      initialProps: {
        series,
      },
      wrapper: Wrapper,
    });
    return { result, rerender, series };
  };

  it('registers a series based on the id with dataType category', async () => {
    const { result } = setupTest();

    await waitFor(() => {
      expect(result.current.series[123].dataType).toEqual('time');
    });
  });

  describe('for bar charts', () => {
    it('aggregates the data by period and method', () => {
      // backend data provides 3 dates
      const data = [
        { label: '2024-01-02', value: '64' },
        { label: '2024-01-05', value: '100' },
        { label: '2024-02-06', value: '110' },
      ];
      const partialSeries = {
        data,
        aggregateValues: {
          aggregatePeriod: AGGREGATE_PERIOD.monthly,
          aggregateMethod: AGGREGATE_METHOD.sum,
        },
      };
      const { result } = setupTest(partialSeries);

      // expection that data is grouped by month and aggregated by sum, with a month either side
      const expectedData = [
        { label: '2024-01-01', value: 164 },
        { label: '2024-02-01', value: 110 },
      ];

      expect(result.current.series[123].data).toEqual(expectedData);
    });
  });

  describe('for line charts', () => {
    it('aggregates the data by period and method', () => {
      // backend data provides 3 dates
      const data = [
        { label: '2024-01-02', value: '64' },
        { label: '2024-01-05', value: '100' },
        { label: '2024-02-06', value: '110' },
      ];
      const partialSeries = {
        data,
        aggregateValues: {
          aggregatePeriod: AGGREGATE_PERIOD.monthly,
          aggregateMethod: AGGREGATE_METHOD.sum,
        },
        type: SERIES_TYPES.line,
      };
      const { result } = setupTest(partialSeries);

      // expection that data is grouped by month and aggregated by sum
      const expectedData = [
        { label: '2024-01-01', value: 164 },
        { label: '2024-02-01', value: 110 },
      ];

      expect(result.current.series[123].data).toEqual(expectedData);
    });
  });
});
