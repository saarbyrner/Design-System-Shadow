import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LastXPeriodPicker from '../index';

describe('LastXPeriodPicker component', () => {
  let props;

  beforeEach(() => {
    props = {
      onPeriodLengthChange: jest.fn(),
      onTimePeriodChange: jest.fn(),
      timePeriod: 'days',
      periodLength: null,
      t: (key) => key, // i18n stub
    };
  });

  describe('when the time period is changed', () => {
    it('calls the correct callback', async () => {
      render(<LastXPeriodPicker {...props} periodLength="3" />);
      await userEvent.click(screen.getByText('Weeks'));
      expect(props.onTimePeriodChange).toHaveBeenCalledWith('weeks');
      expect(props.onPeriodLengthChange).toHaveBeenCalledWith(21);
    });
  });

  it('calls the correct callback when the value is changed', async () => {
    render(<LastXPeriodPicker {...props} />);
    await userEvent.type(screen.getByRole('spinbutton'), '3');
    expect(props.onPeriodLengthChange).toHaveBeenCalledWith(3);
  });

  it('sets the input label correctly', () => {
    render(<LastXPeriodPicker {...props} inputLabel="Custom label" />);
    expect(screen.getByText('Custom label')).toBeInTheDocument();
  });
});
