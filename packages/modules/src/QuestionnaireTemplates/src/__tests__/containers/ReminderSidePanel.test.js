import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ReminderSidePanelContainer from '../../containers/ReminderSidePanel';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <ReminderSidePanel /> Container', () => {
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks(); // Clear mocks before each test
    window.featureFlags = {};

    // Define a base preloaded state for the Redux store
    preloadedState = {
      reminderSidePanel: {
        templateId: '1',
        isOpen: true, // Make the panel visible for tests
        notifyAthletes: true,
        scheduledTime: '10:30:00',
        localTimeZone: 'Europe/Dublin',
        scheduledDays: {
          monday: true,
          tuesday: true,
          wednesday: false,
          thursday: false,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<ReminderSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Verify the panel is rendered by checking its title
    expect(screen.getByText('Schedule Reminders')).toBeInTheDocument();

    // Verify a value from the state is correctly passed as a prop
    expect(screen.getByRole('textbox')).toHaveValue('10:30 am');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('maps dispatch to props and calls closeSidePanel when the close button is clicked', async () => {
    renderWithRedux(<ReminderSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(templateActions.closeSidePanel).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls saveScheduleReminder when the save button is clicked', async () => {
    renderWithRedux(<ReminderSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(templateActions.saveScheduleReminder).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls toggleNotifyAthletes when the toggle is clicked', async () => {
    renderWithRedux(<ReminderSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(templateActions.toggleNotifyAthletes).toHaveBeenCalledTimes(1);
  });

  describe('[feature-flag] repeat-reminders', () => {
    beforeEach(() => {
      window.featureFlags['repeat-reminders'] = true;
    });

    it('maps dispatch to props and calls toggleDay when a day is clicked', async () => {
      renderWithRedux(<ReminderSidePanelContainer />, {
        useGlobalStore: false,
        preloadedState,
      });

      // Find the button for Wednesday (W) and click it
      const wednesdayButton = screen.getByText('W');
      await user.click(wednesdayButton);

      expect(templateActions.toggleDay).toHaveBeenCalledTimes(1);
      expect(templateActions.toggleDay).toHaveBeenCalledWith('wednesday');
    });
  });
});
