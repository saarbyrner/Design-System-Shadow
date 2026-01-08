import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import TimePicker from '..';

describe('TimePicker component', () => {
  const props = {
    t: (key) => key,
  };

  it('shows a custom label if one is passed', () => {
    render(<TimePicker {...props} label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('set the value to the timepicker', () => {
    const timeValue = moment().set('hour', 12).set('minute', 30);
    render(<TimePicker {...props} value={timeValue} />);

    expect(screen.getByRole('textbox')).toHaveValue('12:30 pm');
  });

  it('calls onChange when the timepicker value changes', async () => {
    const onchangeSpy = jest.fn();
    render(<TimePicker {...props} onChange={onchangeSpy} />);
    await userEvent.click(screen.getByRole('textbox'));

    const hoursList = screen.getAllByRole('list')[0];
    const minutesList = screen.getAllByRole('list')[1];

    await userEvent.click(within(hoursList).getByText('11'));
    expect(moment(onchangeSpy.mock.calls[0][0]).format('hh')).toEqual('11');

    await userEvent.click(within(minutesList).getByText('15'));
    expect(moment(onchangeSpy.mock.calls[1][0]).format('mm')).toEqual('15');
  });

  it('disables the timepicker when disabled is true', () => {
    render(<TimePicker {...props} onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets the defaultOpenValue to the timepicker', async () => {
    const defaultValue = moment().set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    render(<TimePicker {...props} defaultOpenValue={defaultValue} />);

    await userEvent.click(screen.getByRole('textbox'));

    const hoursList = screen.getAllByRole('list')[0];
    const defaultHourButton = within(hoursList).getAllByRole('button')[0];
    const minutesList = screen.getAllByRole('list')[1];
    const defaultMinuteButton = within(minutesList).getAllByRole('button')[0];

    expect(within(defaultHourButton).getByText('12')).toBeInTheDocument();
    expect(within(defaultMinuteButton).getByText('00')).toBeInTheDocument();
  });

  it('sets the value to the timepicker regardless of defaultOpenValue', () => {
    const defaultValue = moment().set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const timeValue = moment().set({
      hour: 9,
      minute: 10,
      second: 0,
      millisecond: 0,
    });
    render(
      <TimePicker
        {...props}
        value={timeValue}
        defaultOpenValue={defaultValue}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('9:10 am');
  });

  it('applies the minuteStep property to the timepicker', async () => {
    render(<TimePicker {...props} minuteStep={6} />);
    await userEvent.click(screen.getByRole('textbox'));

    const minutesList = screen.getAllByRole('list')[1];
    expect(within(minutesList).getAllByRole('button')).toHaveLength(10); // 60/6=10
  });

  describe('When the update-time-picker flag is on', () => {
    beforeEach(() => {
      window.featureFlags['update-time-picker'] = true;
    });

    afterEach(() => {
      window.featureFlags['update-time-picker'] = false;
    });

    it('applies the default minuteStep (5) to the timepicker', async () => {
      render(<TimePicker {...props} />);
      await userEvent.click(screen.getByRole('textbox'));

      const minutesList = screen.getAllByRole('list')[1];
      expect(within(minutesList).getAllByRole('button')).toHaveLength(12); // 60/5=12
    });

    it('applies the minuteStep override value to the timepicker', async () => {
      render(<TimePicker {...props} minuteStep={10} />);
      await userEvent.click(screen.getByRole('textbox'));

      const minutesList = screen.getAllByRole('list')[1];
      expect(within(minutesList).getAllByRole('button')).toHaveLength(6); // 60/10=6
    });
  });
  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<TimePicker {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<TimePicker {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
