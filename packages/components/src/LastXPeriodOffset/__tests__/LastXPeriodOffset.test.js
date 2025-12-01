import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LastXPeriodOffset from '..';

describe('<LastXPeriodOffset /> component', () => {
  const props = { onUpdateTimePeriodLengthOffset: jest.fn(), t: (t) => t };

  it('renders the period picker when switching the toggle on', async () => {
    const { container } = render(<LastXPeriodOffset {...props} />);

    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(container.getElementsByClassName('lastXPeriodPicker')).toHaveLength(
      0
    );

    await userEvent.click(screen.getByRole('switch'));

    expect(screen.getByRole('switch')).toBeChecked();
    expect(container.getElementsByClassName('lastXPeriodPicker')).toHaveLength(
      1
    );
  });

  it('shows the period picker by default when showOffsetField exists', () => {
    render(<LastXPeriodOffset {...props} timePeriodLengthOffset={5} />);
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('spinbutton')).toHaveValue(5);
  });

  it('disables the period picker when disabled prop is true', () => {
    render(
      <LastXPeriodOffset {...props} timePeriodLengthOffset={5} disabled />
    );
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('empties the time period offset when switching off the offset', async () => {
    render(<LastXPeriodOffset {...props} timePeriodLengthOffset={5} />);

    await userEvent.click(screen.getByRole('switch'));
    expect(props.onUpdateTimePeriodLengthOffset).toHaveBeenCalledWith(null);
  });
});
