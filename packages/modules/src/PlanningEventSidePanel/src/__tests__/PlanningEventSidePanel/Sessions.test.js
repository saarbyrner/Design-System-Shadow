import 'core-js/stable/structured-clone';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { RRule } from 'rrule';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';

import { axios } from '@kitman/common/src/utils/services';
import getRecurrencePreferences from '@kitman/services/src/services/planning/getRecurrencePreferences';
import { componentRender, saveEvent } from './testHelpers';

// eslint-disable-next-line jest/no-mocks-import
import { sessionEvent } from '../../__mocks__/PlanningEventSidePanel';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/services/src/services/planning/getRecurrencePreferences');

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock(
  '@kitman/services/src/services/OrganisationSettings/Notifications',
  () => {
    return {
      ...jest.requireActual(
        '@kitman/services/src/services/OrganisationSettings/Notifications'
      ),
      useGetNotificationTriggersQuery: jest.fn(),
    };
  }
);

const mockUseGetNotificationTriggersQuery = useGetNotificationTriggersQuery;

const mockDefaultTriggers = [
  {
    area: 'event',
    enabled_channels: {
      staff: ['email'],
      athlete: ['push'],
    },
  },
];

describe('Sessions', () => {
  let component;

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    getRecurrencePreferences.mockReturnValue([]);
    mockUseGetNotificationTriggersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockDefaultTriggers,
    });
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.restoreAllMocks();
    cleanup();
  });

  describe('renders', () => {
    it('renders PlanningEventSidePanel with expanding panel with correct title', async () => {
      component = await componentRender('EXPANDING', sessionEvent);
      expect(component.getByTestId('ExpandingPanel')).toBeInTheDocument();
      expect(component.getByText('New Session')).toBeInTheDocument();
    });
    it('renders PlanningEventSidePanel with sliding panel with correct title', async () => {
      component = await componentRender('SLIDING', sessionEvent);
      expect(component.getByTestId('sliding-panel|title')).toBeInTheDocument();
      expect(component.getByText('New Session')).toBeInTheDocument();
    });
    it('renders the correct titles for each Session event panelMode', async () => {
      component = await componentRender('SLIDING', sessionEvent, 'DUPLICATE');
      expect(component.getByText('Duplicate Session')).toBeInTheDocument();
      component = await componentRender('SLIDING', sessionEvent, 'EDIT');
      expect(component.getByText('Edit Session')).toBeInTheDocument();
    });

    it('renders the Actions buttons with the correct callbacks', async () => {
      const onClose = jest.fn();
      component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
        onClose,
      });
      expect(component.getByText('Cancel')).toBeInTheDocument();
      expect(component.getByText('Save')).toBeInTheDocument();
      await component.user.click(component.getByText('Cancel'));
      expect(onClose).toHaveBeenCalled();
    });

    describe('onUpdatedEventTimeInfoCallback', () => {
      const onUpdatedEventTimeInfoCallback = jest.fn();
      it('calls onUpdatedEventTimeInfoCallback callback when the time changes', async () => {
        component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
          onUpdatedEventTimeInfoCallback,
        });
        await component.user.click(
          component.container.querySelector('.rc-time-picker-input')
        );
        await component.user.click(component.getAllByText('12')[0]);
        expect(onUpdatedEventTimeInfoCallback).toHaveBeenCalled();
      });

      it('calls onUpdatedEventTimeInfoCallback callback when the date changes', async () => {
        component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
          onUpdatedEventTimeInfoCallback,
        });
        fireEvent.change(component.getByDisplayValue('2021-07-12'), {
          target: { value: '2021-07-13' },
        });
        expect(onUpdatedEventTimeInfoCallback).toHaveBeenCalled();
      });

      it('calls onUpdatedEventTimeInfoCallback callback when the duration changes', async () => {
        component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
          onUpdatedEventTimeInfoCallback,
        });
        await component.user.type(component.getByDisplayValue('20'), '50');
        expect(onUpdatedEventTimeInfoCallback).toHaveBeenCalled();
      });

      it('calls onUpdatedEventTimeInfoCallback callback when the timezone changes', async () => {
        component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
          onUpdatedEventTimeInfoCallback,
        });
        await component.user.click(component.getByText('Europe/Dublin'));
        await component.user.click(component.getByText('Africa/Accra'));
        expect(onUpdatedEventTimeInfoCallback).toHaveBeenCalled();
      });
    });
    it('calls onUpdatedEventTitleCallback callback when the title changes', async () => {
      window.setFlag('planning-show-event-title-in-creation-and-edit', true);
      const onUpdatedEventTitleCallback = jest.fn();
      component = await componentRender('EXPANDING', sessionEvent, 'CREATE', {
        onUpdatedEventTitleCallback,
      });
      await component.user.type(
        component.getAllByRole('textbox')[1],
        'test title'
      );
      expect(onUpdatedEventTitleCallback).toHaveBeenCalled();
      window.setFlag('planning-show-event-title-in-creation-and-edit', false);
    });
  });

  describe("with 'event-notifications' FF", () => {
    const modalTitle = 'Confirm you would like to notify selected recipients?';

    beforeAll(() => {
      // Mock scrollIntoView to prevent errors in tests where validation fails
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    beforeEach(() => {
      window.setFlag('event-notifications', true);
      // The title field for sessions is behind a feature flag
      window.setFlag('planning-show-event-title-in-creation-and-edit', true);
    });

    it('should open the notification modal upon clicking save if a key field has changed', async () => {
      const { user } = await componentRender('SLIDING', sessionEvent, 'EDIT');

      // For sessions, the title is a key field.
      const titleInput = screen.getByLabelText('Title');
      await user.clear(titleInput);
      fireEvent.change(titleInput, {
        target: { value: 'A New Session Title' },
      });

      await user.click(screen.getByText('Save'));

      expect(screen.getByText(modalTitle)).toBeInTheDocument();
    });

    it('should NOT open the notification modal in EDIT mode if no key fields have changed', async () => {
      const cleanSessionEvent = {
        id: '1',
        duration: 20,
        title: '',
        description: null,
        local_timezone: 'Europe/Dublin',
        start_time: '2021-07-12T10:00:16+00:00',
        editable: false,
        type: 'session_event',
        session_type_id: 1,
        session_type: {
          id: 1,
          name: 'some session',
        },
        team_id: null,
        venue_type_id: null,
        workload_type: 1,
        game_day_minus: null,
        game_day_plus: null,
      };

      const { user } = await componentRender(
        'SLIDING',
        cleanSessionEvent,
        'EDIT'
      );

      // With a truly unchanged state, we click save.
      await user.click(screen.getByText('Save'));

      // The modal should not appear.
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });

    it('should NOT open notification modal if default channels are empty', async () => {
      mockUseGetNotificationTriggersQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data: [
          {
            area: 'event',
            enabled_channels: {
              staff: [],
              athlete: [],
            },
          },
        ],
      });

      const { user } = await componentRender('SLIDING', sessionEvent, 'EDIT');

      const titleInput = screen.getByLabelText('Title');
      await user.clear(titleInput);
      fireEvent.change(titleInput, {
        target: { value: 'A New Session Title' },
      });

      await user.click(screen.getByText('Save'));

      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });

    it('should always open the notification modal upon clicking save in CREATE mode', async () => {
      const { user, container } = await componentRender(
        'SLIDING',
        sessionEvent,
        'CREATE'
      );

      // For CREATE mode, we must ensure the form is valid.
      // For sessions, this means selecting a session type.
      await waitFor(() => {
        expect(screen.getByLabelText('Session type')).toBeInTheDocument();
      });

      const allSelects = container.querySelectorAll('.kitmanReactSelect input');
      const sessionTypeSelect = allSelects[0];
      await user.click(sessionTypeSelect);

      // FIX: Use findAllByText to get all matching elements, then click the correct one.
      // The option in the dropdown list is the one we want to click.
      const options = await screen.findAllByText('Agility');
      await user.click(options[options.length - 1]);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });

      await user.click(saveButton);

      expect(screen.getByText(modalTitle)).toBeInTheDocument();
    });
  });

  describe('repeat-sessions', () => {
    const eventWithRecurrence = {
      ...sessionEvent,
      recurrence: {
        rule: RRule.fromString(`DTSTART:20231114T105546Z
RRULE:FREQ=DAILY`),
        original_start_time: null,
        recurring_event_id: null,
      },
    };
    const eventModalTitle = 'Edit event';

    it('should not open the save verification modal - FF is off and no repeat rule', async () => {
      await componentRender('EXPANDING', sessionEvent, 'EDIT');
      await saveEvent();
      expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
    });

    it('should not open the save verification modal - FF is off', async () => {
      await componentRender('EXPANDING', eventWithRecurrence, 'EDIT');
      await saveEvent();
      expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
    });

    describe("with the 'repeat-sessions' FF on", () => {
      beforeEach(() => {
        window.setFlag('repeat-sessions', true);
      });

      afterEach(() => {
        window.setFlag('repeat-sessions', false);
        jest.restoreAllMocks();
      });

      const saveNewSession = jest.spyOn(axios, 'post');

      it('should not open the save verification modal - no repeat rule', async () => {
        await componentRender('EXPANDING', sessionEvent, 'EDIT');
        await saveEvent();
        expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
      });

      it('should not open the save verification modal - a new event', async () => {
        const { container, user } = await componentRender(
          'EXPANDING',
          sessionEvent,
          'CREATE'
        );
        await waitFor(() => {
          expect(screen.getByLabelText('Session type')).toBeInTheDocument();
        });
        const allSelects = container.querySelectorAll(
          '.kitmanReactSelect input'
        );
        const eventTypeSelect = allSelects[0];
        await user.click(eventTypeSelect);
        await user.click(screen.getAllByText('Agility')[0]);

        const repeatSelect = allSelects[2];
        await user.click(repeatSelect);
        await user.click(screen.getByText('Daily'));

        await saveEvent();
        expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
      });

      it('should open the save verification modal if not a new event', async () => {
        await componentRender('EXPANDING', eventWithRecurrence, 'EDIT');
        await saveEvent();
        expect(screen.getByText(eventModalTitle)).toBeInTheDocument();
      });

      it("should close the modal and do nothing upon clicking on 'Cancel'", async () => {
        const { user } = await componentRender(
          'EXPANDING',
          eventWithRecurrence,
          'EDIT'
        );
        await saveEvent();

        const modalTitleElement = screen.getByText(eventModalTitle);
        expect(modalTitleElement).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
          expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
        });
        expect(saveNewSession).not.toHaveBeenCalled();
      });

      it("should close the modal upon clicking of 'OK' and saveEvent", async () => {
        const updateSession = jest.spyOn(axios, 'patch');

        const { user } = await componentRender(
          'EXPANDING',
          eventWithRecurrence,
          'EDIT'
        );
        await saveEvent();

        const modalTitleElement = screen.getByText(eventModalTitle);
        expect(modalTitleElement).toBeInTheDocument();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
        });
        expect(updateSession).toHaveBeenCalled();
      });

      it('should call updateSession with scope', async () => {
        const updateSession = jest.spyOn(axios, 'patch');

        const { user } = await componentRender(
          'EXPANDING',
          eventWithRecurrence,
          'EDIT'
        );
        await saveEvent();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
        });

        expect(updateSession.mock.calls[0][1]).toEqual(
          expect.objectContaining({
            recurrence: {
              original_start_time: null,
              recurring_event_id: null,
              rule: 'FREQ=DAILY',
              scope: 'next',
            },
          })
        );
      });

      it('should update rrule if is custom rule with remaining recurrence', async () => {
        const updateSession = jest.spyOn(axios, 'patch');
        const mockRRuleInstances = [
          '20250320T123607Z',
          '20250321T123607Z',
          '20250322T123607Z',
          '20250323T123607Z',
          '20250324T123607Z',
        ];
        const originalCount = 5;
        const updatedCount = 4;

        const { user } = await componentRender(
          'EXPANDING',
          {
            ...eventWithRecurrence,
            start_date: '20250321T123607Z',
            recurrence: {
              ...eventWithRecurrence.recurrence,
              rule: RRule.fromString(
                `FREQ=DAILY;INTERVAL=1;COUNT=${originalCount}`
              ),
              rrule_instances: mockRRuleInstances,
            },
          },
          'EDIT'
        );
        await saveEvent();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(eventModalTitle)).not.toBeInTheDocument();
        });

        expect(updateSession.mock.calls[0][1]).toEqual(
          expect.objectContaining({
            recurrence: {
              original_start_time: null,
              recurring_event_id: null,
              rrule_instances: mockRRuleInstances,
              rule: `FREQ=DAILY;INTERVAL=1;COUNT=${updatedCount}`,
              scope: 'next',
            },
          })
        );
      });
    });
  });
});
