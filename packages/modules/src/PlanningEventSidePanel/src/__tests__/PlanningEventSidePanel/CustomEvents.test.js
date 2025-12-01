import 'core-js/stable/structured-clone';
import { VirtuosoMockContext } from 'react-virtuoso';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { RRule } from 'rrule';

import { axios } from '@kitman/common/src/utils/services';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { data as customEventTypesData } from '@kitman/services/src/mocks/handlers/planning/getCustomEventTypes';
import PlanningEventSidePanel from '../../../index';
import { StaffVisibilityOptions } from '../../components/custom/utils';
import { saveEvent } from './testHelpers';
// eslint-disable-next-line jest/no-mocks-import
import { commonProps } from '../../__mocks__/PlanningEventSidePanel';

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

describe('Custom Events', () => {
  const undefinedProps = {
    are_participants_duplicated: undefined,
    athlete_events_count: undefined,
    description: undefined,
    event_location: undefined,
    humidity: undefined,
    surface_quality: undefined,
    surface_type: undefined,
    temperature: undefined,
    weather: undefined,
    duplicate_event_activities: undefined,
    no_participants: undefined,
  };

  const startTime = '2021-07-12T10:00:16+00:00';

  const nonChangedFields = {
    local_timezone: 'Europe/Dublin',
    type: 'custom_event',
    name: 'Coaches Sync',
    duration: 60,
    editable: true,
  };

  const customEvent = {
    id: 456,
    custom_event_type: customEventTypesData[3],
    start_date: startTime,
    ...nonChangedFields,
  };

  const customSharedEvent = {
    id: 567,
    custom_event_type: { ...customEventTypesData[3], shared: true },
    start_date: startTime,
    ...nonChangedFields,
  };

  const commonCalledWithEvent = {
    id: customEvent.id,
    custom_event_type_id: customEventTypesData[3].id,
    event_collection_complete: false,
    start_time: startTime,
    send_notifications: false,
    ...nonChangedFields,
    ...undefinedProps,
  };

  beforeEach(() => {
    window.setFlag('custom-events', true);
    mockUseGetNotificationTriggersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockDefaultTriggers,
    });
  });

  const saveExistingCustomEvent = jest.spyOn(axios, 'patch');
  const saveExistingCustomEventUrl = `/planning_hub/events/${customEvent.id}`;

  const renderCustomEvent = ({ mode, planningEvent = customEvent }) => {
    const dynamicProps =
      mode === 'EDIT'
        ? {
            planningEvent,
            createNewEventType: undefined,
          }
        : {
            createNewEventType: 'custom_event',
          };
    return renderWithProviders(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 500, itemHeight: 500 }}
      >
        <PlanningEventSidePanel
          {...commonProps}
          {...dynamicProps}
          panelMode={mode}
          panelType="SLIDING"
          isPitchViewEnabled={false}
        />
      </VirtuosoMockContext.Provider>
    );
  };

  it('sends the correct payload for a custom event', async () => {
    renderCustomEvent({ mode: 'EDIT' });

    await saveEvent();

    expect(saveExistingCustomEvent).toHaveBeenCalledWith(
      saveExistingCustomEventUrl,
      {
        ...commonCalledWithEvent,
      },
      { params: {} }
    );
  });

  describe('when the staff-visibility-custom-events FF is on', () => {
    const userIds = [1, 2, 3];

    beforeEach(() => {
      window.setFlag('staff-visibility-custom-events', true);
    });

    afterEach(() => {
      window.setFlag('staff-visibility-custom-events', false);
    });

    it('calls the correct payload when all staff is selected', async () => {
      const user = userEvent.setup();
      const visibilityIds = [];

      renderCustomEvent({
        mode: 'EDIT',
        planningEvent: {
          ...customEvent,
          staff_visibility: StaffVisibilityOptions.allStaff,
          visibility_ids: visibilityIds,
        },
      });

      await user.click(screen.getByText('Save'));
      expect(saveExistingCustomEvent).toHaveBeenCalledWith(
        saveExistingCustomEventUrl,
        {
          ...commonCalledWithEvent,
          visibility_ids: visibilityIds,
        },
        { params: {} }
      );
    });

    it('calls the correct payload when selected staff is selected', async () => {
      const user = userEvent.setup();
      renderCustomEvent({
        mode: 'EDIT',
        planningEvent: {
          ...customEvent,
          staff_visibility: StaffVisibilityOptions.onlySelectedStaff,
          user_ids: userIds,
          visibility_ids: [],
        },
      });

      await user.click(screen.getByText('Save'));
      expect(saveExistingCustomEvent).toHaveBeenCalledWith(
        saveExistingCustomEventUrl,
        {
          ...commonCalledWithEvent,
          user_ids: userIds,
          visibility_ids: userIds,
        },
        { params: {} }
      );
    });

    it('calls the correct payload when selected and additional staff is selected', async () => {
      const user = userEvent.setup();
      const visibilityIds = [4, 5, 6];
      renderCustomEvent({
        mode: 'EDIT',
        planningEvent: {
          ...customEvent,
          staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          user_ids: userIds,
          visibility_ids: visibilityIds,
        },
      });

      await user.click(screen.getByText('Save'));
      expect(saveExistingCustomEvent).toHaveBeenCalledWith(
        saveExistingCustomEventUrl,
        {
          ...commonCalledWithEvent,
          user_ids: userIds,
          visibility_ids: visibilityIds.concat(userIds),
        },
        { params: {} }
      );
    });
  });

  describe('shared event behaviour', () => {
    const featureFlags = [
      'shared-custom-events',
      'custom-events',
      'repeat-events',
      'staff-visibility-custom-events',
    ];

    beforeEach(() => {
      featureFlags.forEach((flag) => window.setFlag(flag, true));
    });

    afterEach(() => {
      featureFlags.forEach((flag) => window.setFlag(flag, false));
    });

    const queryRepeatsInput = () => screen.queryByText(/repeats/i);
    const queryStaffVisibilityInput = () =>
      screen.queryByText(/staff visibility/i);

    describe('when editing a shared custom event', () => {
      it('hides "Repeats" and "Staff visibility" inputs', () => {
        renderCustomEvent({ mode: 'EDIT', planningEvent: customSharedEvent });

        expect(queryRepeatsInput()).not.toBeInTheDocument();
        expect(queryStaffVisibilityInput()).not.toBeInTheDocument();
      });
    });

    describe('when editing a non-shared custom event', () => {
      it('shows "Repeats" and "Staff visibility" inputs', () => {
        renderCustomEvent({ mode: 'EDIT', planningEvent: customEvent });

        expect(queryRepeatsInput()).toBeInTheDocument();
        expect(queryStaffVisibilityInput()).toBeInTheDocument();
      });
    });
  });

  describe('repeat-events', () => {
    const eventWithRecurrence = {
      ...customEvent,
      recurrence: {
        rule: RRule.fromString(`DTSTART:20231114T105546Z
RRULE:FREQ=DAILY`),
        original_start_time: null,
        recurring_event_id: null,
      },
    };
    const modalTitle = 'Edit event';

    describe("with the 'repeat-events' FF on", () => {
      beforeEach(() => {
        window.setFlag('repeat-events', true);
      });

      const saveNewCustomEvent = jest.spyOn(axios, 'post');
      const updateCustomEvent = jest.spyOn(axios, 'patch');

      it('should not open the event action modal - no repeat rule', async () => {
        renderCustomEvent({ mode: 'EDIT' });
        await saveEvent();
        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
      });

      it('should not open the event action modal - a new event', async () => {
        const user = userEvent.setup();
        const { container } = renderCustomEvent({ mode: 'CREATE' });
        await waitFor(() => {
          expect(screen.getByLabelText('Event Type')).toBeInTheDocument();
        });
        const allSelects = container.querySelectorAll(
          '.kitmanReactSelect input'
        );
        const eventTypeSelect = allSelects[0];
        await user.click(eventTypeSelect);
        await user.click(screen.getByText('Player Care - Mental Wellbeing'));
        await user.click(screen.getByText('Nutrition Meeting'));

        const repeatSelect = allSelects[2];
        await user.click(repeatSelect);
        await user.click(screen.getByText('Daily'));

        await saveEvent();
        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
      });

      it('should open the event action modal', async () => {
        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: eventWithRecurrence,
        });
        await saveEvent();
        expect(screen.getByText(modalTitle)).toBeInTheDocument();
      });

      it("should close the modal and do nothing upon clicking on 'Cancel'", async () => {
        const user = userEvent.setup();
        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: eventWithRecurrence,
        });
        await saveEvent();

        const modalTitleElement = screen.getByText(modalTitle);
        expect(modalTitleElement).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });
        expect(saveNewCustomEvent).not.toHaveBeenCalled();
      });

      it("should close the modal upon clicking of 'OK' and saveEvent", async () => {
        const user = userEvent.setup();
        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: eventWithRecurrence,
        });
        await saveEvent();

        const modalTitleElement = screen.getByText(modalTitle);
        expect(modalTitleElement).toBeInTheDocument();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });
        expect(updateCustomEvent).toHaveBeenCalled();
      });

      it('should call updateCustomEvent with scope', async () => {
        const user = userEvent.setup();
        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: eventWithRecurrence,
        });
        await saveEvent();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });

        expect(updateCustomEvent.mock.calls[0][1]).toEqual(
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
        const user = userEvent.setup();
        const mockRRuleInstances = [
          '20250320T123607Z',
          '20250321T123607Z',
          '20250322T123607Z',
          '20250323T123607Z',
          '20250324T123607Z',
        ];
        const originalCount = 5;
        const updatedCount = 4;

        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: {
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
        });
        await saveEvent();

        await user.click(screen.getByText('OK'));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });

        expect(updateCustomEvent.mock.calls[0][1]).toEqual(
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

  describe("with 'event-notifications' FF", () => {
    const modalTitle = 'Confirm you would like to notify selected recipients?';

    it('should not open the notification modal when FF is off', async () => {
      renderCustomEvent({ mode: 'EDIT' });
      await saveEvent();

      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    });

    describe('when the FF is on', () => {
      beforeEach(() => {
        window.setFlag('event-notifications', true);
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
      });

      it('should open the notification modal upon clicking save', async () => {
        const user = userEvent.setup();

        renderCustomEvent({ mode: 'EDIT' });

        // Find the event name input and change its value
        const eventNameInput = screen.getByLabelText('Title');
        await user.clear(eventNameInput);
        fireEvent.change(eventNameInput, {
          target: { value: 'A New Event Name' },
        });

        await user.click(screen.getByText('Save'));

        expect(screen.getByText(modalTitle)).toBeInTheDocument();
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

        const user = userEvent.setup();

        renderCustomEvent({
          mode: 'EDIT',
          planningEvent: {
            ...customEvent,
            user_ids: [1, 2, 3],
          },
        });

        const eventNameInput = screen.getByLabelText('Title');
        await user.clear(eventNameInput);
        fireEvent.change(eventNameInput, {
          target: { value: 'A New Event Name' },
        });

        await user.click(screen.getByText('Save'));

        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
      });

      it('should call save with send_notifications: true when user clicks "Send"', async () => {
        const user = userEvent.setup();

        renderCustomEvent({ mode: 'EDIT' });

        // Find the title input and change its value
        const titleInput = screen.getByLabelText('Title');
        await user.clear(titleInput);
        fireEvent.change(titleInput, {
          target: { value: 'A New Event Name' },
        });

        await user.click(screen.getByText('Save'));

        expect(screen.getByText(modalTitle)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Send' }));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });

        expect(saveExistingCustomEvent).toHaveBeenCalledWith(
          saveExistingCustomEventUrl,
          expect.objectContaining({ send_notifications: true }),
          { params: {} }
        );
      });

      it('should call save with send_notifications: false when user clicks "Don\'t send"', async () => {
        const user = userEvent.setup();

        renderCustomEvent({ mode: 'EDIT' });

        // Find the title input and change its value
        const titleInput = screen.getByLabelText('Title');
        await user.clear(titleInput);
        fireEvent.change(titleInput, {
          target: { value: 'A New Event Name' },
        });

        await user.click(screen.getByText('Save'));
        expect(screen.getByText(modalTitle)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: "Don't send" }));

        await waitFor(() => {
          expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        });

        expect(saveExistingCustomEvent).toHaveBeenCalledWith(
          saveExistingCustomEventUrl,
          expect.objectContaining({ send_notifications: false }),
          { params: {} }
        );
      });
    });
  });
});
