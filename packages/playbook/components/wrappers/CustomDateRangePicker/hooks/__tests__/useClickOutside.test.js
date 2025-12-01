import { renderHook } from '@testing-library/react-hooks';
import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  let ref;
  let handler;
  let element;

  beforeEach(() => {
    // Create a div element to use as our ref
    element = document.createElement('div');
    ref = { current: element };
    handler = jest.fn();
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.clearAllMocks();
  });

  it('should call handler when clicking outside the referenced element', () => {
    renderHook(() => useClickOutside(ref, handler));

    // Simulate click outside
    const mouseEvent = new MouseEvent('mousedown');
    document.dispatchEvent(mouseEvent);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when clicking inside the referenced element', () => {
    renderHook(() => useClickOutside(ref, handler));

    // Simulate click inside
    const mouseEvent = new MouseEvent('mousedown');
    element.dispatchEvent(mouseEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle touch events outside the referenced element', () => {
    renderHook(() => useClickOutside(ref, handler));

    // Simulate touch outside
    const touchEvent = new TouchEvent('touchstart');
    document.dispatchEvent(touchEvent);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when touching inside the referenced element', () => {
    renderHook(() => useClickOutside(ref, handler));

    // Simulate touch inside
    const touchEvent = new TouchEvent('touchstart');
    element.dispatchEvent(touchEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when ref is null', () => {
    const nullRef = { current: null };
    renderHook(() => useClickOutside(nullRef, handler));

    const mouseEvent = new MouseEvent('mousedown');
    document.dispatchEvent(mouseEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove event listeners on cleanup', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickOutside(ref, handler));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
