import { render, screen, act } from '@testing-library/react';
import DelayedLoadingFeedback from '..';

describe('<DelayedLoadingFeedback /> component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders a loading feedback after .5 seconds', () => {
    render(<DelayedLoadingFeedback />);
    expect(screen.queryByText('Loading ...')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });
});
