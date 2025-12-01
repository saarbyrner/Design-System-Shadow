import { render, screen, act } from '@testing-library/react';
import moment from 'moment-timezone';
import Countdown from '..';

describe('Countdown', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('displays the correct countdown', () => {
    const targetDate = moment().add(1, 'hours');
    render(<Countdown targetDate={targetDate} />);
    expect(screen.getByText(/60:00/)).toBeInTheDocument();
  });

  it('updates the countdown correctly', () => {
    const targetDate = moment().add(1, 'hours');
    render(<Countdown targetDate={targetDate} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/59:59/)).toBeInTheDocument();
  });
});
