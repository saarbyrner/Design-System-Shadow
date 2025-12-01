import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import moment from 'moment';
import CollectionChannelsForm from '../CollectionChannelsForm';

const defaultProps = {
  event: {
    id: 1,
    rpe_collection_athlete: true,
    mass_input: true,
    rpe_collection_kiosk: true,
    notification_schedule: {
      id: 1,
      scheduled_time: '2021-04-23T15:24:57.000Z',
    },
  },
  isOpen: true,
  sendingNotification: false,
  notifications: [{ sent_at: '2021-04-23T15:24:57.000Z' }],
  sendNotifications: jest.fn(),
  onClose: jest.fn(),
  onUpdateEvent: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<CollectionChannelsForm />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClose when clicking the close button', async () => {
    const user = userEvent.setup();
    render(<CollectionChannelsForm {...defaultProps} />);
    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('initializes the fields correctly', () => {
    render(<CollectionChannelsForm {...defaultProps} />);

    // Use role-based queries to check for the checkboxes and toggle switch
    expect(
      screen.getByRole('checkbox', { name: /Athlete App/i })
    ).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Kiosk App/i })).toBeChecked();
  });

  it('displays the last sent notification and an option to send more when rpe_collection_athlete is true', async () => {
    const user = userEvent.setup();
    const propsWithNotifications = {
      ...defaultProps,
      notifications: [
        { sent_at: moment().subtract(60, 'minutes').toISOString() },
      ],
    };
    render(
      <CollectionChannelsForm
        event={defaultProps.event}
        {...propsWithNotifications}
      />
    );

    // Check for the "Last sent" text and the send notification button
    expect(
      document.querySelector('.collectionChannelsForm__lastSentNotification')
    ).toBeInTheDocument();

    // Simulate clicking the send notification button
    const send = screen.getByRole('button', { name: 'Send' });
    await user.click(send);

    // Assert that the sendNotifications function was called
    expect(defaultProps.sendNotifications).toHaveBeenCalledTimes(1);
  });

  it('disables the athlete type section when rpe_collection_athlete is false', () => {
    const propsWithoutAthlete = {
      ...defaultProps,
      event: { ...defaultProps.event, rpe_collection_athlete: false },
    };
    render(<CollectionChannelsForm {...propsWithoutAthlete} />);

    // The toggle switch and send button should be disabled
    expect(screen.getAllByRole('switch')[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('enables the athlete type section when rpe_collection_athlete is enabled', async () => {
    const user = userEvent.setup();
    const propsWithoutAthlete = {
      ...defaultProps,
      event: { ...defaultProps.event, rpe_collection_athlete: false },
    };
    render(
      <CollectionChannelsForm
        event={defaultProps.event}
        {...propsWithoutAthlete}
      />
    );

    // Initially disabled
    expect(screen.getAllByRole('switch')[0]).toBeDisabled();

    // Toggle the Athlete App checkbox to enable the section
    await user.click(screen.getByRole('checkbox', { name: /Athlete App/i }));

    // The component should update and enable the toggle and button
    expect(screen.getAllByRole('switch')[0]).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('disables the Kiosk View and List View radio inputs section when rpe_collection_kiosk is false', () => {
    const propsWithoutKiosk = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        rpe_collection_kiosk: false,
        rpe_collection_athlete: false,
      },
    };
    render(<CollectionChannelsForm {...propsWithoutKiosk} />);

    expect(document.querySelectorAll('.inputRadio--disabled')).toHaveLength(2);
  });

  it('saves the form and closes the modal when clicking save', async () => {
    const user = userEvent.setup();
    // We mock the onUpdateEvent prop to check if it's called
    const mockOnUpdateEvent = jest.fn();
    render(
      <CollectionChannelsForm
        {...defaultProps}
        updateEventData={mockOnUpdateEvent}
      />
    );

    // Click the save button
    await user.click(screen.getByRole('button', { name: /Save/i }));

    expect(mockOnUpdateEvent).toHaveBeenCalledTimes(1);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('opens the RPE request modal when a notification was sent recently', async () => {
    const user = userEvent.setup();
    const propsWithRecentNotification = {
      ...defaultProps,
      notifications: [
        { sent_at: moment().subtract(15, 'minutes').toISOString() },
      ],
    };
    render(<CollectionChannelsForm {...propsWithRecentNotification} />);

    // Click the send notification button. This should open the modal.
    await user.click(screen.getByRole('button', { name: 'Send' }));

    // Assert that the RPE request modal is now in the document.
    expect(screen.getByText('Send RPE Request')).toBeInTheDocument();
  });
});
