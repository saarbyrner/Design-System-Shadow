import { renderHook, act } from '@testing-library/react-hooks';
import useChartControlsState from '../useChartControlsState';

jest.mock('../../components/Context');

describe('analysis XYChart hooks | useChartControlState', () => {
  describe('when using scroll behaviour', () => {
    it('returns the data to read scroll state', () => {
      const { result } = renderHook(() => useChartControlsState());

      expect(result.current.controls.scroll).toStrictEqual({
        isActive: false,
        startIndex: 0,
        endIndex: 0,
      });
    });

    it('returns methods that update the scroll state', () => {
      const { result } = renderHook(() => useChartControlsState());

      act(() => {
        result.current.controlsApi.setScroll({
          isActive: true,
          startIndex: 1,
          endIndex: 6,
        });
      });

      expect(result.current.controls.scroll).toStrictEqual({
        isActive: true,
        startIndex: 1,
        endIndex: 6,
      });
    });
  });

  describe('hiding and setting hidden series', () => {
    it('returns default hidden series', () => {
      const { result } = renderHook(() => useChartControlsState());

      expect(result.current.controls.hiddenSeries).toStrictEqual([]);
    });

    it('returns the method that updates the hidden series', () => {
      const { result } = renderHook(() => useChartControlsState());

      const seriesLabel = {
        datum: 'International Squad',
        index: 0,
        text: 'International Squad',
        value: '#3A8DEE',
      };

      act(() => {
        result.current.controlsApi.setHiddenSeries([seriesLabel]);
      });

      expect(result.current.controls.hiddenSeries).toStrictEqual([seriesLabel]);
    });
  });
});
