import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import SeriesWrapper from '../components/SeriesWrapper';
import { ChartContextProvider } from '../components/Context';
import useChartContext from '../hooks/useChartContext';
import { AGGREGATE_METHOD, AGGREGATE_PERIOD } from '../constants';

describe('analysis shared|SeriesWrapper', () => {
  const setupTest = () => {
    const valueAccessor = jest.fn();
    const categoryAccessor = jest.fn();

    const series = {
      id: 123,
      data: [],
      type: 'bar',
      dataType: 'category',
      valueAccessor,
      categoryAccessor,
    };

    const Wrapper = (props) => (
      <ChartContextProvider>
        <SeriesWrapper {...props.series}>{props.children}</SeriesWrapper>
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

  it('renders child and registers a new series', async () => {
    const { result, series } = setupTest();

    await waitFor(() => {
      expect(result.current.series).toEqual(
        expect.objectContaining({ 123: series })
      );
    });
  });

  it('updates the data when passed in', async () => {
    const { result, rerender, series } = setupTest();

    const NEW_DATA = [
      { label: 'blah', value: 123 },
      { label: 'blah di blah', value: 246 },
    ];

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: series })
    );

    act(() => {
      rerender({
        series: {
          ...series,
          data: NEW_DATA,
        },
      });
    });

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: { ...series, data: NEW_DATA } })
    );
  });

  it('updates the type when passed in', async () => {
    const { result, rerender, series } = setupTest();

    const NEW_TYPE = 'line';

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: series })
    );

    act(() => {
      rerender({
        series: {
          ...series,
          type: NEW_TYPE,
        },
      });
    });

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: { ...series, type: 'line' } })
    );
  });

  it('updates the aggregateValues when passed in', async () => {
    const { result, rerender, series } = setupTest();
    const aggregateValues = {
      aggregatePeriod: AGGREGATE_PERIOD.weekly,
      aggregateMethod: AGGREGATE_METHOD.sum,
    };

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: series })
    );

    act(() => {
      rerender({
        series: {
          ...series,
          aggregateValues,
        },
      });
    });

    expect(result.current.series).toEqual(
      expect.objectContaining({
        123: {
          ...series,
          aggregateValues,
        },
      })
    );
  });

  it('updates the isGrouped attribute when data changes', () => {
    const { result, rerender, series } = setupTest();
    const NEW_DATA = [
      {
        label: 'label 1',
        values: [
          {
            label: 'Series 1',
            value: 123,
          },
          {
            label: 'Series 2',
            value: 456,
          },
        ],
      },
    ];

    expect(result.current.series).toEqual(
      expect.objectContaining({ 123: series })
    );

    act(() => {
      rerender({
        series: {
          ...series,
          data: NEW_DATA,
          isGrouped: true,
        },
      });
    });

    expect(result.current.series).toEqual(
      expect.objectContaining({
        123: { ...series, data: NEW_DATA, isGrouped: true },
      })
    );
  });
});
