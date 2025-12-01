import { render, screen, act } from '@testing-library/react';
import useIsTabActive from '../useIsTabActive';

function TestComponent() {
  const isTabActive = useIsTabActive();

  return <div>Tab is {isTabActive ? 'Active' : 'Inactive'}</div>;
}

describe('useIsTabActive', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true when window is focused initially', () => {
    render(<TestComponent />);
    expect(screen.getByText(/Tab is Active/i)).toBeInTheDocument();
  });

  it('should update to false when window blurs', () => {
    render(<TestComponent />);

    act(() => {
      window.dispatchEvent(new Event('blur'));
    });

    expect(screen.getByText(/Tab is Inactive/i)).toBeInTheDocument();
  });

  it('should update back to true when window focuses again', () => {
    render(<TestComponent />);

    // Simulate blur
    act(() => {
      window.dispatchEvent(new Event('blur'));
    });
    expect(screen.getByText(/Tab is Inactive/i)).toBeInTheDocument();

    // Simulate focus
    act(() => {
      window.dispatchEvent(new Event('focus'));
    });
    expect(screen.getByText(/Tab is Active/i)).toBeInTheDocument();
  });
});
