import { renderHook } from '@testing-library/react-hooks';
import useComponentDimensions from '../useComponentDimensions';

describe('useComponentDimensions', () => {
  const height = 600;
  const width = 800;
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    // mock ResizeObserver here
    global.ResizeObserver = class MockedResizeObserver {
      constructor(cb) {
        setTimeout(() => {
          cb(
            [
              {
                contentRect: {
                  height,
                  width,
                },
              },
            ],
            this
          );
        }, 150);
      }

      observe = mockObserve;

      disconnect = mockDisconnect;
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
  });

  it('calls observes and disconnects to the ResizeObserver correctly', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useComponentDimensions(ref));

    expect(mockObserve).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
