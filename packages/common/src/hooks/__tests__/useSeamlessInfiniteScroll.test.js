import { act, renderHook } from '@testing-library/react-hooks';
import { useSeamlessInfiniteScroll } from '../useSeamlessInfiniteScroll';

describe('useSeamlessInfiniteScroll', () => {
  let mockObserve;
  let mockDisconnect;
  let mockTrigger;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();
    mockTrigger = undefined;

    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn((callback) => {
      mockTrigger = (isIntersecting) => {
        callback([{ isIntersecting }]);
      };

      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  it('does not observe when disabled', () => {
    const onEndReached = jest.fn();

    renderHook(() =>
      useSeamlessInfiniteScroll({ enabled: false, onEndReached })
    );

    expect(mockObserve).not.toHaveBeenCalled();
    expect(mockTrigger).toBeUndefined();
  });

  it('calls onEndReached when element intersects', () => {
    const onEndReached = jest.fn();

    const { result, rerender } = renderHook(
      ({ enabled }) => useSeamlessInfiniteScroll({ enabled, onEndReached }),
      { initialProps: { enabled: true } }
    );

    // Assign ref to an element
    const div = document.createElement('div');
    act(() => {
      result.current.watchRef.current = div;
    });

    // 🔑 rerender so useEffect runs again with ref set
    rerender({ enabled: true });

    expect(mockObserve).toHaveBeenCalledWith(div);
    expect(typeof mockTrigger).toBe('function');

    // simulate intersection
    act(() => {
      mockTrigger?.(true);
    });

    expect(onEndReached).toHaveBeenCalledTimes(1);
  });

  it('disconnects observer on cleanup', () => {
    const onEndReached = jest.fn();

    const { unmount, rerender, result } = renderHook(
      ({ enabled }) => useSeamlessInfiniteScroll({ enabled, onEndReached }),
      { initialProps: { enabled: true } }
    );

    // Give it a node to observe, then rerender
    act(() => {
      result.current.watchRef.current = document.createElement('div');
    });
    rerender({ enabled: true });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('does nothing if enabled but ref is null', () => {
    const onEndReached = jest.fn();

    renderHook(() =>
      useSeamlessInfiniteScroll({ enabled: true, onEndReached })
    );

    // No element assigned, so observer never created
    expect(mockObserve).not.toHaveBeenCalled();
    expect(mockTrigger).toBeUndefined();
  });
});
