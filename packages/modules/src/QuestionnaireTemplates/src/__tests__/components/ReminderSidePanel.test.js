import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import selectEvent from 'react-select-event';
import ReminderSidePanel from '../../components/ReminderSidePanel';

describe('ReminderSidePanel component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {}; // Reset feature flags

    baseProps = {
      isOpen: true,
      notifyAthletes: true,
      scheduledTime: '10:20:20',
      localTimeZone: 'Europe/Amsterdam',
      scheduledDays: { monday: true },
      onToggleNotifyAthletes: jest.fn(),
      onChangeScheduleTime: jest.fn(),
      onChangeScheduleDay: jest.fn(),
      onClickCloseSidePanel: jest.fn(),
      onClickSaveScheduleReminder: jest.fn(),
      onChangeLocalTimeZone: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('calls onClickCloseSidePanel when the close button is clicked', async () => {
    render(<ReminderSidePanel {...baseProps} />);
    const closeButton = screen.getByTestId('panel-close-button');

    await user.click(closeButton);

    expect(baseProps.onClickCloseSidePanel).toHaveBeenCalledTimes(1);
  });

  it('renders the athlete app form with initial values', () => {
    render(<ReminderSidePanel {...baseProps} />);

    expect(screen.getByText('Schedule push notification')).toBeInTheDocument();
    // The ToggleSwitch is a checkbox role
    expect(screen.getByRole('switch')).toBeChecked();
    // The TimePicker renders an input with the specified time
    expect(screen.getByDisplayValue('10:20 am')).toBeInTheDocument();
  });

  it('calls the correct prop when updating the notification toggle', async () => {
    render(<ReminderSidePanel {...baseProps} />);
    // The ToggleSwitch is a checkbox role
    const toggle = screen.getByRole('switch');

    await user.click(toggle);

    expect(baseProps.onToggleNotifyAthletes).toHaveBeenCalledTimes(1);
  });

  it('disables the time picker when athlete notification is off', () => {
    render(<ReminderSidePanel {...baseProps} notifyAthletes={false} />);

    const timeInput = screen.getByRole('textbox');

    expect(timeInput).toBeDisabled();
  });

  it('calls the correct prop when saving the schedule reminder', async () => {
    render(<ReminderSidePanel {...baseProps} />);

    // The FormValidator triggers successAction on submit, so we click the submit button
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.onClickSaveScheduleReminder).toHaveBeenCalledTimes(1);
  });

  describe('[feature-flag] timezone-form-scheduling', () => {
    beforeEach(() => {
      window.featureFlags['timezone-form-scheduling'] = true;
    });

    it('renders a timezone dropdown', () => {
      render(<ReminderSidePanel {...baseProps} />);

      expect(screen.getByText('Time Zone')).toBeInTheDocument();
    });

    it('calls the correct callback when selecting a timezone', async () => {
      render(<ReminderSidePanel {...baseProps} />);
      const timeZonePicker = screen.getByText('Time Zone');
      // Use selectEvent for custom dropdowns
      await selectEvent.select(timeZonePicker, 'Europe/Dublin');

      expect(baseProps.onChangeLocalTimeZone).toHaveBeenCalledWith(
        'Europe/Dublin'
      );
    });
  });

  describe('[feature-flag] repeat-reminders', () => {
    beforeEach(() => {
      window.featureFlags['repeat-reminders'] = true;
    });

    it('renders the week day selector controls when notifyAthletes is true', () => {
      render(<ReminderSidePanel {...baseProps} />);
      expect(screen.getByText('Select days')).toBeInTheDocument();
      // Check for a specific day button

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getAllByText('T')).toHaveLength(2);
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getAllByText('S')).toHaveLength(2);
    });

    it('does not render the week day selector when notifyAthletes is false', () => {
      render(<ReminderSidePanel {...baseProps} notifyAthletes={false} />);
      expect(screen.queryByText('Select days')).not.toBeInTheDocument();
    });

    it('calls the correct callback when toggling a day', async () => {
      render(<ReminderSidePanel {...baseProps} />);
      const mondayButton = screen.getByText('M');
      await user.click(mondayButton);
      expect(baseProps.onChangeScheduleDay).toHaveBeenCalledWith('monday');
    });
  });
});
