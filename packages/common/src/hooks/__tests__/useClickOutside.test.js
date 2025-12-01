import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
  it('should trigger callback when a click outside occur', async () => {
    const callback = jest.fn();
    const ref = renderHook(() => useClickOutside(callback));

    render(
      <div data-testid="outside-element">
        <div ref={ref} />
      </div>
    );

    userEvent.click(screen.getByTestId('outside-element'));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
