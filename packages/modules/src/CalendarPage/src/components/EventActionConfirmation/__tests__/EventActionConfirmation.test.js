import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderWithProvider,
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import getEventDeletionPrompt from '@kitman/services/src/services/planning/getEventDeletionPrompt';

import EventActionConfirmation from '..';

jest.mock('@kitman/services/src/services/planning/getEventDeletionPrompt');

describe('EventActionConfirmation', () => {
  const onConfirm = jest.fn();
  const onDismiss = jest.fn();
  const props = {
    t: i18nextTranslateStub(),
    onConfirm,
    onDismiss,
    canView: false,
  };
  const storeMock = {
    deleteEvent: { event: null },
    appStatus: { status: null },
  };

  beforeEach(() => {
    getEventDeletionPrompt.mockReturnValue({
      issues: [],
      imported_data: [],
      assessments: [],
    });
  });

  it('should not show any thing while loading', () => {
    const { container } = renderWithProvider(
      <EventActionConfirmation {...props} />,
      storeFake({
        ...storeMock,
        appStatus: { status: 'loading' },
      })
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('calls the onDismiss callback', async () => {
    renderWithProvider(
      <EventActionConfirmation {...props} />,
      storeFake(storeMock)
    );
    await userEvent.click(screen.getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls the onConfirm callback', async () => {
    renderWithProvider(
      <EventActionConfirmation {...props} />,
      storeFake(storeMock)
    );
    await userEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalled();
  });

  describe('repeat events', () => {
    [
      {
        type: 'custom_event',
        modalText: 'event',
        flags: { 'repeat-events': true, 'custom-events': true },
      },
      {
        type: 'session_event',
        modalText: 'session',
        flags: { 'repeat-sessions': true },
      },
    ].forEach(({ type, flags }) => {
      const repeatRuleDeleteEventVirtual = {
        deleteEvent: {
          event: {
            type,
            recurrence: { rule: 'SomeRule', recurring_event_id: 1 },
          },
        },
      };
      const repeatRuleDeleteEventReal = {
        deleteEvent: {
          event: {
            type,
            recurrence: { rule: 'SomeRule', recurring_event_id: null },
          },
        },
      };

      describe(`FF enabled for ${type} event`, () => {
        beforeEach(() => {
          window.featureFlags = flags;
        });

        it('should show the repeat events modal with scope limited to Next, if parent event', () => {
          renderWithProvider(
            <EventActionConfirmation {...props} />,
            storeFake({
              ...storeMock,
              ...repeatRuleDeleteEventReal,
            })
          );

          expect(screen.getByText('Delete event')).toBeInTheDocument();
          expect(screen.queryByText('This event only')).not.toBeInTheDocument();
          expect(
            screen.getByText('This and all following events')
          ).toBeInTheDocument();
        });

        it('should show the repeat events modal with both options, if virtual event', () => {
          renderWithProvider(
            <EventActionConfirmation {...props} />,
            storeFake({
              ...storeMock,
              ...repeatRuleDeleteEventVirtual,
            })
          );

          expect(screen.getByText('Delete event')).toBeInTheDocument();
          expect(screen.queryByText('This event only')).toBeInTheDocument();
          expect(
            screen.getByText('This and all following events')
          ).toBeInTheDocument();
        });

        it('should call the onConfirm callback', async () => {
          renderWithProvider(
            <EventActionConfirmation {...props} />,
            storeFake({
              ...storeMock,
              ...repeatRuleDeleteEventReal,
            })
          );
          await userEvent.click(screen.getByText('Delete'));
          expect(onConfirm).toHaveBeenCalled();
        });

        it('should call the onDismiss callback', async () => {
          renderWithProvider(
            <EventActionConfirmation {...props} />,
            storeFake({
              ...storeMock,
              ...repeatRuleDeleteEventReal,
            })
          );
          await userEvent.click(screen.getByText('Cancel'));
          expect(onDismiss).toHaveBeenCalled();
        });
      });
    });
  });

  it.each([
    { eventType: 'session_event' },
    { eventType: 'game' },
    { eventType: 'custom_event' },
  ])('should render EventActionModal for $eventType', ({ eventType }) => {
    renderWithProvider(
      <EventActionConfirmation {...props} />,
      storeFake({
        ...storeMock,
        deleteEvent: { event: { type: eventType } },
      })
    );
    expect(
      screen.getByText(
        'This will result in loss of participation data and any inputted data on this event. Action cannot be undone.'
      )
    ).toBeInTheDocument();
  });
});
