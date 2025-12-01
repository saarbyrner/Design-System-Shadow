import { renderHook } from '@testing-library/react-hooks';
import useDataReady from '../utils/useDataReady';

describe('useDataReady', () => {
  const rowData = {
    id: 40211,
    athlete: {
      fullname: 'Tomas Albornoz',
      position: 'Second Row',
      avatar_url: 'ath_avatar_url',
      extended_attributes: {},
    },
    availability_status: {
      availability: 'unavailable',
      unavailable_since: '808 days',
    },
    open_injuries_illnesses: {
      issues: [],
      has_more: false,
    },
    most_recent_coaches_note: null,
  };

  it('returns false when grid is empty and gridDataIsLoading is TRUE', () => {
    const { result } = renderHook(() => useDataReady({}, true));
    expect(result.current).toBe(false);
  });

  it('returns false when grid is empty and gridDataIsLoading is FALSE', () => {
    const { result } = renderHook(() => useDataReady({}, false));
    expect(result.current).toBe(false);
  });

  it('returns false when grid is null and gridDataIsLoading is FALSE', () => {
    const { result } = renderHook(() => useDataReady(null, false));
    expect(result.current).toBe(false);
  });

  it('returns true when grid has rows and gridDataIsLoading is FALSE', () => {
    const grid = { rows: [rowData] };
    const { result } = renderHook(() => useDataReady(grid, false));
    expect(result.current).toBe(true);
  });

  it('returns false when grid has rows and gridDataIsLoading is TRUE', () => {
    const grid = { rows: [rowData] };
    const { result } = renderHook(() => useDataReady(grid, true));
    expect(result.current).toBe(false);
  });

  it('returns false when grid has rows but gridDataIsLoading is TRUE', () => {
    const grid = { rows: [rowData] };
    const { result } = renderHook(() => useDataReady(grid, true));
    expect(result.current).toBe(false);
  });
});
