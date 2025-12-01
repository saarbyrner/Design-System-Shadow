import { render } from '@testing-library/react';
import usePrevious from '../usePrevious';

function TestComponent({ value }) {
  const previousValue = usePrevious(value);

  return (
    <div>
      <span>Current Value: {value}</span>
      <span>Previous Value: {previousValue || 'No previous value'}</span>
    </div>
  );
}

describe('usePrevious', () => {
  it('should correctly update the previous value', () => {
    const { getByText, rerender } = render(<TestComponent value={1} />);

    expect(getByText(/Current Value: 1/)).toBeInTheDocument();
    expect(getByText(/Previous Value: No previous value/)).toBeInTheDocument();

    rerender(<TestComponent value={2} />);

    expect(getByText('Current Value: 2')).toBeInTheDocument();
    expect(getByText('Previous Value: 1')).toBeInTheDocument();
  });
});
