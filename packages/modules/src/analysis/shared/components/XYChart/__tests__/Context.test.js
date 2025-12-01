import { act, renderHook } from '@testing-library/react-hooks';
import { ChartContextProvider } from '../components/Context';
import useChartContext from '../hooks/useChartContext';
import { SERIES_TYPES, AXIS_CONFIG } from '../constants';

describe('analysis - XY Chart Context', () => {
  const defaultProviderProps = {
    width: 123,
    height: 123,
  };
  const getChartWrapper = (providerProps) => ({
    wrapper: ({ children }) => (
      <ChartContextProvider {...defaultProviderProps} {...providerProps}>
        {children}
      </ChartContextProvider>
    ),
  });

  it('stores the parentSize data on the context when passed in as a width and height', () => {
    const { result } = renderHook(() => useChartContext(), {
      ...getChartWrapper({ width: 444, height: 555 }),
    });

    expect(result.current.parentSize.width).toBe(444);
    expect(result.current.parentSize.height).toBe(555);
  });

  describe('Chart series utils', () => {
    const testSetup = () => {
      const categoryAccessor = jest.fn();
      const valueAccessor = jest.fn();
      const valueFormatter = jest.fn();
      const commonSeries = {
        categoryAccessor,
        valueAccessor,
        valueFormatter,
      };

      const expectedSeries = {
        123: {
          id: 123,
          data: [],
          dataType: 'category',
          type: SERIES_TYPES.bar,
          isGrouped: false,
          renderAs: null,
          axisConfig: AXIS_CONFIG.left,
          primaryAxis: AXIS_CONFIG.left,
          chartOptions: { hide_null_values: false, hide_zero_values: false },
          name: '',
          axisLabel: '',
          ...commonSeries,
        },
        245: {
          id: 245,
          data: [],
          dataType: 'category',
          type: SERIES_TYPES.bar,
          isGrouped: false,
          renderAs: null,
          axisConfig: AXIS_CONFIG.left,
          primaryAxis: AXIS_CONFIG.left,
          chartOptions: { hide_null_values: false, hide_zero_values: false },
          name: '',
          axisLabel: '',
          ...commonSeries,
        },
      };
      const renderedHook = renderHook(() => useChartContext(), {
        ...getChartWrapper(),
      });

      act(() => {
        renderedHook.result.current.registerSeries(123, commonSeries);
        renderedHook.result.current.registerSeries(245, commonSeries);
      });

      expect(renderedHook.result.current.series).toStrictEqual(expectedSeries);

      return { renderedHook, expectedSeries };
    };

    // eslint-disable-next-line jest/expect-expect
    it('can register a series', () => {
      // running the test setup will test if series can be registered
      testSetup();
    });

    it('can update a series', () => {
      const {
        renderedHook: { result },
        expectedSeries,
      } = testSetup();

      act(() => {
        result.current.updateSeries(123, {
          data: [
            { label: 'data label', value: 245 },
            { label: 'data label 2', value: 250 },
          ],
        });
      });

      expect(result.current.series).toStrictEqual({
        ...expectedSeries,
        123: {
          ...expectedSeries[123],
          data: [
            { label: 'data label', value: 245 },
            { label: 'data label 2', value: 250 },
          ],
        },
      });
    });

    it('can destroy a series', () => {
      const {
        renderedHook: { result },
        expectedSeries,
      } = testSetup();

      act(() => {
        result.current.destroySeries(123);
      });

      expect(result.current.series).toStrictEqual({
        245: expectedSeries[245],
      });
    });

    it('does not modify state if destroySeries is called with a non-existent ID', () => {
      const {
        renderedHook: { result },
        expectedSeries,
      } = testSetup();

      act(() => {
        result.current.destroySeries(999); // Non-existent ID
      });

      expect(result.current.series).toStrictEqual(expectedSeries);
    });

    it('does not throw errors for invalid IDs in destroySeries', () => {
      const renderedHook = renderHook(() => useChartContext(), {
        ...getChartWrapper(),
      });

      act(() => {
        expect(() =>
          renderedHook.result.current.destroySeries(null)
        ).not.toThrow();
        expect(() =>
          renderedHook.result.current.destroySeries(undefined)
        ).not.toThrow();
      });

      expect(renderedHook.result.current.series).toStrictEqual({});
    });
  });
});
