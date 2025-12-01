import { renderHook, act } from '@testing-library/react-hooks';

import { useSelector } from 'react-redux';
import useShouldRefreshDashboard from '../useShouldRefreshDashboard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/selectors/dashboardCache',
  () => ({
    selectRefreshKey: (state) => state.dashboard?.dashboardCacheRefreshKey,
  })
);

describe('useShouldRefreshDashboard', () => {
  let state;

  beforeEach(() => {
    state = { dashboard: { dashboardCacheRefreshKey: '' } };
    useSelector.mockImplementation((selector) => selector(state));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const setKey = (key) => {
    state = {
      ...state,
      dashboard: { ...state.dashboard, dashboardCacheRefreshKey: key },
    };
  };

  it('returns false on initial render even when key is set (skipInitial default)', () => {
    setKey('k1');
    const { result } = renderHook(() => useShouldRefreshDashboard());
    expect(result.current).toBe(false);
  });

  it('returns true exactly once when the key changes to a new non-empty value', () => {
    state.dashboard.dashboardCacheRefreshKey = 'k1';
    const { result, rerender } = renderHook(() => useShouldRefreshDashboard());

    expect(result.current).toBe(false);

    act(() => {
      state.dashboard.dashboardCacheRefreshKey = 'k2';
      rerender();
    });
    expect(result.current).toBe(true);

    act(() => {
      rerender();
    });
    expect(result.current).toBe(false);
  });

  it('does not trigger when key changes to empty string with onlyTruthy=true (default)', () => {
    state.dashboard.dashboardCacheRefreshKey = 'k1';
    const { result, rerender } = renderHook(() => useShouldRefreshDashboard());

    expect(result.current).toBe(false);

    act(() => {
      state.dashboard.dashboardCacheRefreshKey = '';
      rerender();
    });
    expect(result.current).toBe(false);
  });

  it('triggers on initial render when skipInitial is false and key is set', () => {
    state.dashboard.dashboardCacheRefreshKey = 'k-initial';
    const { result } = renderHook(() =>
      useShouldRefreshDashboard(undefined, { skipInitial: false })
    );
    expect(result.current).toBe(true);
  });

  it('respects onlyTruthy=false and triggers when key changes to empty string', () => {
    state.dashboard.dashboardCacheRefreshKey = 'k1';
    const { result, rerender } = renderHook(() =>
      useShouldRefreshDashboard(undefined, { onlyTruthy: false })
    );

    expect(result.current).toBe(false);

    act(() => {
      state.dashboard.dashboardCacheRefreshKey = '';
      rerender();
    });
    expect(result.current).toBe(true);
  });

  it('uses the override key argument instead of Redux state', () => {
    state.dashboard.dashboardCacheRefreshKey = 'k-store';
    const { result, rerender } = renderHook(
      ({ override }) => useShouldRefreshDashboard(override),
      { initialProps: { override: 'ov-1' } }
    );

    expect(result.current).toBe(false);

    act(() => {
      rerender({ override: 'ov-2' });
    });
    expect(result.current).toBe(true);

    act(() => {
      state.dashboard.dashboardCacheRefreshKey = 'k-store-2';
      rerender({ override: 'ov-2' });
    });
    expect(result.current).toBe(false);
  });
});
