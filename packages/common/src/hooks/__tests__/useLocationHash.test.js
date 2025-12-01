import { render, screen, act } from '@testing-library/react';
import useLocationHash from '../useLocationHash';

function TestComponent() {
  const hash = useLocationHash();
  return <div data-testid="hash">{hash}</div>;
}

describe('useLocationHash', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('returns the initial hash', () => {
    window.location.hash = '#initial';

    render(<TestComponent />);

    expect(screen.getByTestId('hash')).toHaveTextContent('#initial');
  });

  it('updates when the hash changes', () => {
    window.location.hash = '#start';
    render(<TestComponent />);
    expect(screen.getByTestId('hash')).toHaveTextContent('#start');

    act(() => {
      window.location.hash = '#updated';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(screen.getByTestId('hash')).toHaveTextContent('#updated');
  });

  it('cleans up the event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<TestComponent />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function)
    );
  });
});
