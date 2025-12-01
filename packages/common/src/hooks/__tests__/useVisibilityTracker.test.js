import { renderHook, act } from '@testing-library/react-hooks';
import useElementVisibilityTracker from '../useElementVisibilityTracker';

describe('useElementVisibilityTracker', () => {
  // Store the original implementation
  const originalIntersectionObserver = global.IntersectionObserver;

  // Mock implementation with control methods
  let mockIntersectionObserverInstance;
  let mockIntersectionObserverCallback;

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Create a mock implementation of IntersectionObserver
    mockIntersectionObserverInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    // Store the callback for later use to trigger observations
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      mockIntersectionObserverCallback = callback;
      return mockIntersectionObserverInstance;
    });
  });

  afterEach(() => {
    // Restore the original implementation after each test
    global.IntersectionObserver = originalIntersectionObserver;
  });

  async function setupTest(config) {
    const { result, rerender } = renderHook(() =>
      useElementVisibilityTracker(config)
    );

    // defaults to true
    expect(result.current[1].isVisible).toBe(false);
    expect(result.current[1].hasBeenVisible).toBe(false);

    // Create a fake DOM element and assign it to ref
    const element = document.createElement('div');
    result.current[0].current = element;

    rerender();

    const triggerIntersection = (isIntersecting) => {
      act(() => {
        mockIntersectionObserverCallback([
          {
            isIntersecting,
            target: document.createElement('div'),
            intersectionRatio: 0.5,
            boundingClientRect: {},
            intersectionRect: {},
            rootBounds: {},
          },
        ]);
      });
    };

    // running all timers to trigger the setTimeout in the hook
    jest.runAllTimers();

    return { result, triggerIntersection };
  }

  it('returns isVisible and hasBeenVisible if an element is available on screen by default', async () => {
    const { result, triggerIntersection } = await setupTest();

    triggerIntersection(true);

    const [, { isVisible, hasBeenVisible }] = result.current;
    expect(isVisible).toBe(true);
    expect(hasBeenVisible).toBe(true);
  });

  it('returns isVisible and hasBeenVisible as false when element is not on screen', async () => {
    const { result, triggerIntersection } = await setupTest();

    triggerIntersection(false);

    const [, { isVisible, hasBeenVisible }] = result.current;
    expect(isVisible).toBe(false);
    expect(hasBeenVisible).toBe(false);
  });

  it('returns hasBeenVisible true when an element enters and leaves screen', async () => {
    const { result, triggerIntersection } = await setupTest();

    triggerIntersection(true);

    // checking if it has updated correctly
    expect(result.current[1].isVisible).toBe(true);
    expect(result.current[1].hasBeenVisible).toBe(true);

    triggerIntersection(false);

    expect(result.current[1].isVisible).toBe(false);
    expect(result.current[1].hasBeenVisible).toBe(true);
  });

  it('will destroy observer after first render if configured to do so', async () => {
    const { result, triggerIntersection } = await setupTest({
      disconnectOnFirstRender: true,
    });

    triggerIntersection(true);

    // checking if it has updated correctly
    expect(result.current[1].isVisible).toBe(true);
    expect(result.current[1].hasBeenVisible).toBe(true);

    triggerIntersection(false);

    expect(result.current[1].isVisible).toBe(false);
    expect(result.current[1].hasBeenVisible).toBe(true);
    expect(mockIntersectionObserverInstance.disconnect).toHaveBeenCalled();
  });
});
