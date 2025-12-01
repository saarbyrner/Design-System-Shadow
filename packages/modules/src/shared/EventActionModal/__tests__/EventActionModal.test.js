/** @typedef {import('../EventActionModal').TranslatedProps} TranslatedProps */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import getEventDeletionPrompt from '@kitman/services/src/services/planning/getEventDeletionPrompt';
import { data as mockDeletionPromptData } from '@kitman/services/src/mocks/handlers/planningHub/getEventDeletionPrompt';

import EventActionModal from '../index';

jest.mock('@kitman/services/src/services/planning/getEventDeletionPrompt');

describe('EventActionModal', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  /** @type {TranslatedProps} */
  const props = {
    t: i18nextTranslateStub(),
    isOpen: true,
    onClose,
    onConfirm,
    action: 'Delete',
    isSubmitting: false,
    eventType: eventTypePermaIds.custom.type,
    eventId: 1,
    isRepeatEvent: false,
  };
  const editProps = { ...props, action: 'Edit' };

  beforeEach(() => {
    getEventDeletionPrompt.mockReturnValue({
      issues: [],
      imported_data: [],
      assessments: [],
    });
  });

  describe.each([
    { eventType: eventTypePermaIds.custom.type },
    { eventType: eventTypePermaIds.session.type },
    { eventType: eventTypePermaIds.game.type },
  ])('title', ({ eventType }) => {
    it('should render the delete action title', async () => {
      render(<EventActionModal {...props} eventType={eventType} />);
      if (eventType !== eventTypePermaIds.custom.type) {
        // eslint-disable-next-line jest/no-conditional-expect
        await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
      }
      expect(screen.getByText('Delete event')).toBeInTheDocument();
    });

    it('should render the edit action title', async () => {
      render(<EventActionModal {...editProps} eventType={eventType} />);
      expect(screen.getByText('Edit event')).toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('should not show loading status if isSubmitting prop is false', async () => {
      render(<EventActionModal {...props} isSubmitting={false} />);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show loading status if isSubmitting prop is true', () => {
      render(<EventActionModal {...props} isSubmitting />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should not render scope options if isRepeatEvent is false', async () => {
      render(
        <EventActionModal
          {...props}
          eventType={eventTypePermaIds.session.type}
        />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
      expect(screen.queryByText('This event only')).not.toBeInTheDocument();
      expect(
        screen.queryByText('This and all following events')
      ).not.toBeInTheDocument();
    });

    describe.each([
      { eventType: eventTypePermaIds.custom.type },
      { eventType: eventTypePermaIds.session.type },
    ])('scope options', ({ eventType }) => {
      it('should render next and this scope options if shouldLimitScopeToNext is false and isRepeatEvent is true', async () => {
        render(
          <EventActionModal
            {...props}
            shouldLimitScopeToNext={false}
            eventType={eventType}
            isRepeatEvent
          />
        );
        if (eventType !== eventTypePermaIds.custom.type) {
          await waitFor(() =>
            // eslint-disable-next-line jest/no-conditional-expect
            expect(getEventDeletionPrompt).toHaveBeenCalled()
          );
        }
        expect(screen.getByText('This event only')).toBeInTheDocument();
        expect(
          screen.getByText('This and all following events')
        ).toBeInTheDocument();
      });

      it('should render next scope options if shouldLimitScopeToNext and isRepeatEvent is true', async () => {
        render(
          <EventActionModal
            {...props}
            shouldLimitScopeToNext
            eventType={eventType}
            isRepeatEvent
          />
        );
        if (eventType !== eventTypePermaIds.custom.type) {
          await waitFor(() =>
            // eslint-disable-next-line jest/no-conditional-expect
            expect(getEventDeletionPrompt).toHaveBeenCalled()
          );
        }
        expect(screen.queryByText(`This event only`)).not.toBeInTheDocument();
        expect(
          screen.getByText('This and all following events')
        ).toBeInTheDocument();
      });
    });

    it('should render warning banner if eventType is game and action is delete', async () => {
      render(
        <EventActionModal {...props} eventType={eventTypePermaIds.game.type} />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
      expect(
        screen.getByText(
          'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
        )
      ).toBeInTheDocument();
    });

    it('should render warning banner with review message if event has linked data', async () => {
      getEventDeletionPrompt.mockReturnValue(mockDeletionPromptData);
      render(
        <EventActionModal
          {...props}
          eventType={eventTypePermaIds.session.type}
        />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
      expect(
        await screen.findByText(
          'This will result in loss of participation data and any inputted data on this event. Action cannot be undone. Please review the table below.'
        )
      ).toBeInTheDocument();
    });

    it('should disable delete button if event has linked issues and show tooltip', async () => {
      getEventDeletionPrompt.mockReturnValue(mockDeletionPromptData);
      render(
        <EventActionModal
          {...props}
          eventType={eventTypePermaIds.session.type}
        />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
      });
      await userEvent.hover(screen.getByRole('button', { name: 'Delete' }), {
        pointerEventsCheck: 0,
      });
      expect(await screen.findByRole('tooltip')).toHaveTextContent(
        'Unlink medical records if you wish to proceed.'
      );
    });

    describe.each([
      { eventType: eventTypePermaIds.custom.type },
      { eventType: eventTypePermaIds.session.type },
    ])('warning banner', ({ eventType }) => {
      it('should render, if shouldShowRepeatEventWarning is true', () => {
        render(
          <EventActionModal
            {...props}
            shouldShowRepeatEventWarning
            eventType={eventType}
            action="Edit"
          />
        );
        expect(
          screen.getByText(
            'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
          )
        ).toBeInTheDocument();
      });

      it('should render, if action is delete', async () => {
        render(<EventActionModal {...props} eventType={eventType} />);
        if (eventType !== eventTypePermaIds.custom.type) {
          await waitFor(() =>
            // eslint-disable-next-line jest/no-conditional-expect
            expect(getEventDeletionPrompt).toHaveBeenCalled()
          );
        }
        expect(
          screen.queryByText(
            'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
          )
        ).toBeInTheDocument();
      });

      it('should not render, if shouldShowRepeatEventWarning is false and action is not delete', () => {
        render(
          <EventActionModal
            {...props}
            shouldShowRepeatEventWarning={false}
            eventType={eventType}
            action="Edit"
          />
        );
        expect(
          screen.queryByText(
            'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
          )
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('getEventDeletionPrompt', () => {
    it('should make request if eventType is session', async () => {
      render(
        <EventActionModal
          {...props}
          eventType={eventTypePermaIds.session.type}
        />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
    });

    it('should make request if eventType is game', async () => {
      render(
        <EventActionModal {...props} eventType={eventTypePermaIds.game.type} />
      );
      await waitFor(() => expect(getEventDeletionPrompt).toHaveBeenCalled());
    });

    it('should not make request if eventType is custom_event', () => {
      render(
        <EventActionModal
          {...props}
          eventType={eventTypePermaIds.custom.type}
        />
      );
      expect(getEventDeletionPrompt).not.toHaveBeenCalled();
    });
  });

  describe('event notifications confirmation modal', () => {
    const notificationModalTitle =
      'Confirm you would like to notify selected recipients?';

    describe('when event-notifications flag is off', () => {
      beforeEach(() => {
        window.setFlag('event-notifications', false);
      });

      it('should call onConfirm directly when clicking the confirm button', async () => {
        const user = userEvent.setup();
        render(<EventActionModal {...editProps} />);

        const confirmButton = screen.getByText('OK');
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledWith({
          recurrenceChangeScope: 'this',
        });
        expect(
          screen.queryByText(notificationModalTitle)
        ).not.toBeInTheDocument();
      });
    });

    describe('when event-notifications flag is on', () => {
      beforeEach(() => {
        window.setFlag('event-notifications', true);
      });

      it('should open the notification modal when clicking the confirm button if key fields have changed', async () => {
        const user = userEvent.setup();
        // Pass shouldShowNotificationsModal={true} AND isNotificationActionable={true}
        render(
          <EventActionModal
            {...editProps}
            shouldShowNotificationsModal
            isNotificationActionable
          />
        );

        const confirmButton = screen.getByText('OK');
        await user.click(confirmButton);

        expect(onConfirm).not.toHaveBeenCalled();
        expect(screen.getByText(notificationModalTitle)).toBeInTheDocument();
      });

      it('should NOT open the notification modal if shouldShowNotificationsModal is false', async () => {
        const user = userEvent.setup();
        render(
          <EventActionModal
            {...editProps}
            isRepeatEvent
            shouldShowNotificationsModal={false}
            isNotificationActionable
          />
        );

        const confirmButton = screen.getByText('OK');
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledWith({
          recurrenceChangeScope: 'this',
        });
        expect(
          screen.queryByText(notificationModalTitle)
        ).not.toBeInTheDocument();
      });

      it('should call onConfirm with sendNotifications: true when clicking "Send"', async () => {
        const user = userEvent.setup();
        render(
          <EventActionModal
            {...editProps}
            isRepeatEvent
            shouldShowNotificationsModal
            isNotificationActionable
          />
        );

        await user.click(screen.getByText('OK'));
        await user.click(screen.getByText('Send'));

        expect(onConfirm).toHaveBeenCalledWith({
          recurrenceChangeScope: 'this',
          sendNotifications: true,
        });

        await waitFor(() => {
          expect(
            screen.queryByText(notificationModalTitle)
          ).not.toBeInTheDocument();
        });
      });

      it('should call onConfirm with sendNotifications: false when clicking "Don\'t Send"', async () => {
        const user = userEvent.setup();
        render(
          <EventActionModal
            {...editProps}
            isRepeatEvent
            shouldShowNotificationsModal
            isNotificationActionable
          />
        );

        await user.click(screen.getByText('OK'));
        await user.click(screen.getByText(`Don't send`));

        expect(onConfirm).toHaveBeenCalledWith({
          recurrenceChangeScope: 'this',
          sendNotifications: false,
        });

        await waitFor(() => {
          expect(
            screen.queryByText(notificationModalTitle)
          ).not.toBeInTheDocument();
        });
      });

      describe('isNotificationActionable prop', () => {
        it('should NOT open the notification modal if isNotificationActionable is false, even if key fields changed', async () => {
          const user = userEvent.setup();
          render(
            <EventActionModal
              {...editProps}
              shouldShowNotificationsModal
              isNotificationActionable={false}
            />
          );

          const confirmButton = screen.getByText('OK');
          await user.click(confirmButton);

          expect(onConfirm).toHaveBeenCalledWith({
            recurrenceChangeScope: 'this',
          });
          expect(
            screen.queryByText(notificationModalTitle)
          ).not.toBeInTheDocument();
        });

        it('should open the notification modal if isNotificationActionable is true and key fields changed', async () => {
          const user = userEvent.setup();
          render(
            <EventActionModal
              {...editProps}
              shouldShowNotificationsModal
              isNotificationActionable
            />
          );

          const confirmButton = screen.getByText('OK');
          await user.click(confirmButton);

          expect(onConfirm).not.toHaveBeenCalled();
          expect(screen.getByText(notificationModalTitle)).toBeInTheDocument();
        });

        it('should NOT open the notification modal on DELETE if isNotificationActionable is false', async () => {
          const user = userEvent.setup();
          render(
            <EventActionModal
              {...props} // props has action='Delete'
              isNotificationActionable={false}
            />
          );

          const deleteButton = screen.getByText('Delete');
          await user.click(deleteButton);

          expect(onConfirm).toHaveBeenCalled();
          expect(
            screen.queryByText(notificationModalTitle)
          ).not.toBeInTheDocument();
        });

        it('should open the notification modal on DELETE if isNotificationActionable is true', async () => {
          const user = userEvent.setup();
          render(
            <EventActionModal
              {...props} // props has action='Delete'
              isNotificationActionable
            />
          );

          const deleteButton = screen.getByText('Delete');
          await user.click(deleteButton);

          expect(onConfirm).not.toHaveBeenCalled();
          expect(screen.getByText(notificationModalTitle)).toBeInTheDocument();
        });
      });
    });
  });

  describe('footer', () => {
    it('should render the Cancel button properly', async () => {
      const user = userEvent.setup();
      render(<EventActionModal {...props} />);
      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
      await user.click(cancelButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('should render the Confirm button properly for delete', async () => {
      const user = userEvent.setup();
      render(<EventActionModal {...props} />);
      const onConfirmButton = screen.getByText('Delete');
      expect(onConfirmButton).toBeInTheDocument();
      await user.click(onConfirmButton);
      expect(onConfirm).toHaveBeenCalled();
    });

    it('should render the Confirm button properly for edit', async () => {
      render(<EventActionModal {...editProps} />);
      const onConfirmButton = screen.getByText('OK');
      expect(onConfirmButton).toBeInTheDocument();
      await userEvent.click(onConfirmButton);
      expect(onConfirm).toHaveBeenCalled();
    });
  });
});
