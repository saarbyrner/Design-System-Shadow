import $ from 'jquery';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionChannelsForm from '../CollectionChannelsForm';

jest.mock('jquery', () => {
  const actualJquery = jest.requireActual('jquery');
  actualJquery.ajax = jest.fn();
  actualJquery.Deferred = () => {
    let resolveFn;
    const promise = new Promise((resolve) => {
      resolveFn = resolve;
    });
    return {
      resolveWith: (context, args) => {
        resolveFn(...args);
        return promise;
      },
    };
  };
  return actualJquery;
});

const defaultProps = {
  event: {
    id: 1,
    rpe_collection_athlete: true,
    mass_input: true,
    rpe_collection_kiosk: true,
    notification_schedule: {
      id: 1,
      scheduled_time: '2021-04-23T15:24:57.000+01:00',
    },
  },
  isOpen: true,
  sendingNotification: false,
  notifications: [{ sent_at: '2021-04-23T15:24:57.000+01:00' }],
  sendNotifications: jest.fn(),
  onClose: jest.fn(),
  onUpdateEvent: jest.fn(),
  t: (t) => t,
};

describe('<CollectionChannelsForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('calls onClose when closing the modal', async () => {
    const user = userEvent.setup();
    render(<CollectionChannelsForm {...defaultProps} />);
    const closeBtns = screen.getAllByRole('button');
    await user.click(closeBtns[0]);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays last sent notification and option to send more when rpe_collection_athlete is true', async () => {
    const user = userEvent.setup();

    const props = {
      ...defaultProps,
      notifications: [{ sent_at: moment().subtract(60, 'minutes') }],
    };
    render(<CollectionChannelsForm {...props} />);
    const sendNotificationButton = screen.getAllByRole('button')[1];
    await user.click(sendNotificationButton);
    expect(props.sendNotifications).toHaveBeenCalledTimes(1);
    expect(
      document.querySelectorAll('.collectionChannelsForm__lastSentNotification')
    ).toHaveLength(1);
  });

  it('initiates the fields correctly', () => {
    render(<CollectionChannelsForm {...defaultProps} />);
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('disables athlete type section when rpe_collection_athlete is false', () => {
    render(
      <CollectionChannelsForm
        {...defaultProps}
        event={{ ...defaultProps.event, rpe_collection_athlete: false }}
      />
    );
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });

  it('enables athlete type section when rpe_collection_athlete is enabled', async () => {
    const user = userEvent.setup();
    render(
      <CollectionChannelsForm
        {...defaultProps}
        event={{ ...defaultProps.event, rpe_collection_athlete: false }}
      />
    );
    const athleteCheckbox = screen.getByRole('checkbox', {
      name: 'Athlete App',
    });
    await user.click(athleteCheckbox);
    expect(screen.getByRole('switch')).toBeEnabled();
    expect(screen.getAllByRole('button')[0]).toBeEnabled();
  });

  it('disables kiosk type section when rpe_collection_kiosk is false', () => {
    render(
      <CollectionChannelsForm
        {...defaultProps}
        event={{ ...defaultProps.event, rpe_collection_kiosk: false }}
      />
    );

    expect(
      screen.getByRole('checkbox', { name: 'Kiosk App' })
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.inputRadio--disabled')).toHaveLength(2);
  });

  describe('when toggling the notification schedule', () => {
    const deletedNotificationEvent = {
      ...defaultProps.event,
      notification_schedule: null,
    };

    afterEach(() => {
      $.ajax.mockReset();
    });

    it('deletes when a notification schedule exists', async () => {
      const user = userEvent.setup();
      render(<CollectionChannelsForm {...defaultProps} />);
      const notificationScheduleToggle = screen.getByRole('switch');
      await user.click(notificationScheduleToggle);

      // Wait for the UI to update after the click
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('does not try to delete after sending an rpe if there is no schedule', async () => {
      const user = userEvent.setup();
      render(
        <CollectionChannelsForm
          {...defaultProps}
          event={deletedNotificationEvent}
        />
      );
      expect(screen.getByRole('switch')).not.toBeChecked();
      const rpeButton = screen.getAllByRole('button')[1];
      await user.click(rpeButton);
      expect($.ajax).not.toHaveBeenCalled();
    });

    it('deletes when a notification schedule exists and athlete app is unchecked', async () => {
      const user = userEvent.setup();
      render(<CollectionChannelsForm {...defaultProps} />);
      const notificationScheduleToggle = screen.getByRole('switch');
      const athleteAppCheckbox = screen.getByRole('checkbox', {
        name: 'Athlete App',
      });

      expect(notificationScheduleToggle).toBeChecked();
      expect(athleteAppCheckbox).toBeInTheDocument();

      await user.click(athleteAppCheckbox);

      expect(athleteAppCheckbox).not.toBeChecked();
      expect($.ajax).toHaveBeenCalledWith(
        expect.objectContaining({
          contentType: 'application/json',
          method: 'DELETE',
          url: '/planning_hub/events/1/notification_schedules',
        })
      );
    });
  });

  describe('when the save request is successful', () => {
    const updatedEvent = {
      id: 1,
      rpe_collection_athlete: false,
      mass_input: false,
      rpe_collection_kiosk: false,
    };

    beforeEach(() => {
      $.ajax.mockImplementation((options) => {
        if (options.url === `/planning_hub/events/${defaultProps.event.id}`) {
          return $.Deferred().resolveWith(null, [{ event: updatedEvent }]);
        }
        return $.Deferred().resolveWith(null, [{}]);
      });
    });

    afterEach(() => {
      $.ajax.mockReset();
    });

    it('saves the form when clicking save', async () => {
      const user = userEvent.setup();
      const onCloseMock = jest.fn();
      render(
        <CollectionChannelsForm {...defaultProps} onClose={onCloseMock} />
      );
      const kioskAppCheckbox = screen.getByRole('checkbox', {
        name: 'Kiosk App',
      });
      const kioskViewRadioBtn =
        document.querySelectorAll('.inputRadio__input')[0];
      const athleteAppCheckbox = screen.getByRole('checkbox', {
        name: 'Athlete App',
      });

      await user.click(kioskAppCheckbox);
      await user.click(kioskViewRadioBtn);
      await user.click(athleteAppCheckbox);

      const saveBtn = screen.getByRole('button', { name: 'Save' });
      await user.click(saveBtn);

      expect($.ajax).toHaveBeenNthCalledWith(1, {
        contentType: 'application/json',
        method: 'DELETE',
        url: '/planning_hub/events/1/notification_schedules',
      });
      expect($.ajax).toHaveBeenNthCalledWith(2, {
        contentType: 'application/json',
        data: '{"rpe_collection_athlete":false,"mass_input":true,"rpe_collection_kiosk":false}',
        method: 'PATCH',
        url: '/planning_hub/events/1',
      });
    });
  });

  describe('when a notification was sent in the last thirty minutes', () => {
    it('opens the rpe request modal', async () => {
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        notifications: [{ sent_at: moment().subtract(15, 'minutes') }],
      };
      render(<CollectionChannelsForm {...props} />);
      const sendNotificationButton = screen.getAllByRole('button')[1];
      await user.click(sendNotificationButton);

      expect(screen.getByText('Send RPE Request')).toBeInTheDocument();
    });
  });
});
