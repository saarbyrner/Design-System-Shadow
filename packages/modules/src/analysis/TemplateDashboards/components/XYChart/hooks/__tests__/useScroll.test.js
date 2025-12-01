import { renderHook } from '@testing-library/react-hooks';
import useScroll from '../useScroll';

describe('useScroll', () => {
  it('shouldScroll will be false if there are less items than will fit comforably', () => {
    const { result } = renderHook(() => useScroll(5, 400, 'bar'));

    expect(result.current.shouldScroll).toBe(false);
  });

  it('shouldScroll will be true if there is not enough space for all the bars', () => {
    const { result } = renderHook(() => useScroll(20, 400, 'bar'));

    expect(result.current.shouldScroll).toBe(true);
  });

  it('shouldScroll will always be false for line', () => {
    const { result } = renderHook(() => useScroll(20, 400, 'line'));

    expect(result.current.shouldScroll).toBe(false);
  });
});
