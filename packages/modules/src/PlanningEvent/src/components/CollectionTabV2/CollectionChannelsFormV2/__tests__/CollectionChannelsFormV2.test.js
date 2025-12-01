import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  deleteNotificationSchedule,
  createNotificationSchedule,
} from '@kitman/modules/src/PlanningEvent/src/services/athleteNotifications';
import editEvent from '@kitman/modules/src/PlanningEvent/src/services/editEvent';

import CollectionChannelsFormV2 from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/services/athleteNotifications'
);
jest.mock('@kitman/modules/src/PlanningEvent/src/services/editEvent');

describe('<CollectionChannelsFormV2 />', () => {
  const notificationSchedule = {
    id: 1,
    scheduled_time: '2021-04-23T15:24:57.000+01:00',
  };

  const mockProps = {
    event: {
      id: 1,
      rpe_collection_athlete: false,
      mass_input: true,
      rpe_collection_kiosk: false,
      notification_schedule: null,
      type: 'session_event',
    },
    isOpen: true,
    notifications: [{ sent_at: '2021-04-23T15:24:57.000+01:00' }],
    sendNotifications: jest.fn(),
    onClose: jest.fn(),
    updateEventData: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = mockProps) =>
    renderWithUserEventSetup(<CollectionChannelsFormV2 {...props} />);

  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  describe('Athlete App collection', () => {
    const enableCollectionLabelText = 'Enable Athlete App collection';
    const sendNotificationButtonText = 'Request RPE now';
    const scheduleNotificationLabelText =
      'Automatically request RPE at session end';

    it('should not render content if athlete app collection is not checked', () => {
      renderComponent();
      expect(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: sendNotificationButtonText })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('checkbox', { name: scheduleNotificationLabelText })
      ).not.toBeInTheDocument();
    });

    it('should render content if athlete app collection is checked', async () => {
      const { user } = renderComponent();
      await user.click(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      );
      expect(
        await screen.findByRole('checkbox', {
          name: scheduleNotificationLabelText,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: sendNotificationButtonText })
      ).toBeInTheDocument();
    });

    it('should check schedule rpe request checkbox when parent checkbox is checked', async () => {
      const { user } = renderComponent();
      await user.click(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      );

      expect(
        await screen.findByRole('checkbox', {
          name: enableCollectionLabelText,
        })
      ).toBeChecked();
      expect(
        await screen.findByRole('checkbox', {
          name: scheduleNotificationLabelText,
        })
      ).toBeChecked();
    });

    it('should delete notification schedule when requesting rpe now and send notification', async () => {
      deleteNotificationSchedule.mockReturnValue({
        event: {
          ...mockProps.event,
          rpe_collection_athlete: true,
          notification_schedule: null,
        },
      });

      const { user } = renderComponent({
        ...mockProps,
        event: {
          ...mockProps.event,
          rpe_collection_athlete: true,
          notification_schedule: notificationSchedule,
        },
      });
      await user.click(
        screen.getByRole('button', { name: sendNotificationButtonText })
      );

      expect(mockProps.sendNotifications).toHaveBeenCalled();
      expect(deleteNotificationSchedule).toHaveBeenCalled();
      expect(mockProps.updateEventData).toHaveBeenCalled();
    });

    it('should not attempt to delete notification schedule when requesting rpe now if schedule does not exist', async () => {
      const { user } = renderComponent({
        ...mockProps,
        event: {
          ...mockProps.event,
          rpe_collection_athlete: true,
          notification_schedule: null,
        },
      });
      await user.click(
        screen.getByRole('button', { name: sendNotificationButtonText })
      );

      expect(mockProps.sendNotifications).toHaveBeenCalled();
      expect(deleteNotificationSchedule).not.toHaveBeenCalled();
    });

    it('should create a new notification schedule on click of save and track event', async () => {
      editEvent.mockReturnValue(mockProps);
      const { user } = renderComponent();
      await user.click(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(createNotificationSchedule).toHaveBeenCalled();
      expect(trackEventMock).toHaveBeenCalledWith(
        'Planning - RPE Collection Channels - Save collection channels',
        {
          AthleteAppCollection: false,
          KioskAppCollection: false,
          KioskAppDisplayStyle: null,
        }
      );
    });

    it('should delete the scheduled notification on click of save, if already existing', async () => {
      const { user } = renderComponent({
        ...mockProps,
        event: {
          ...mockProps.event,
          rpe_collection_athlete: true,
          notification_schedule: notificationSchedule,
        },
      });
      await user.click(
        screen.getByRole('checkbox', { name: scheduleNotificationLabelText })
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(deleteNotificationSchedule).toHaveBeenCalled();
      expect(createNotificationSchedule).not.toHaveBeenCalled();
    });
  });

  describe('Kiosk App collection', () => {
    const enableCollectionLabelText = 'Enable Kiosk App collection';
    const displayStyleLabelText = 'Kiosk athlete display style';

    it('should not render content if athlete app collection is not checked', () => {
      renderComponent();
      expect(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      ).toBeInTheDocument();
      expect(screen.queryByText(displayStyleLabelText)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('radio', { name: 'Grid' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('radio', { name: 'List' })
      ).not.toBeInTheDocument();
    });

    it('should render content if kiosk app collection is checked', async () => {
      const { user } = renderComponent();
      await user.click(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      );

      expect(screen.getByText(displayStyleLabelText)).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Grid' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    });

    it('should update the event with the correct values on save and track event', async () => {
      editEvent.mockReturnValue({
        ...mockProps,
        event: {
          ...mockProps.event,
          rpe_collection_kiosk: true,
          mass_input: false,
        },
      });
      const { user } = renderComponent();
      await user.click(
        screen.getByRole('checkbox', { name: enableCollectionLabelText })
      );
      await user.click(screen.getByRole('radio', { name: 'List' }));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(editEvent).toHaveBeenCalledWith(1, {
        mass_input: 'false', // mass_input = false is the same as 'List'
        rpe_collection_athlete: false,
        rpe_collection_kiosk: true,
      });
      expect(trackEventMock).toHaveBeenCalledWith(
        'Planning - RPE Collection Channels - Save collection channels',
        {
          AthleteAppCollection: false,
          KioskAppCollection: true,
          KioskAppDisplayStyle: 'List',
        }
      );
    });
  });
});
