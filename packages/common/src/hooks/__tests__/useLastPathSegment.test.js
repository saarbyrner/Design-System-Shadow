import { renderHook } from '@testing-library/react-hooks';
import useLastPathSegment from '../useLastPathSegment';

describe('useLastPathSegment', () => {
  it('returns the last segment of the URL', () => {
    const mockPath = '/league-schedule/match-report/123';
    jest
      .spyOn(global, 'location', 'get')
      .mockImplementation(() => ({ pathname: mockPath }));

    const { result } = renderHook(() => useLastPathSegment());

    expect(result.current).toBe('123');
  });
});
