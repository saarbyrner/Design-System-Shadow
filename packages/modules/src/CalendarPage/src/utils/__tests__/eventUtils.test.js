import 'core-js/stable/structured-clone';
import { RRule } from 'rrule';
import moment from 'moment-timezone';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { calendarEventTypeEnumLike } from '@kitman/components/src/Calendar/utils/enum-likes';
// eslint-disable-next-line jest/no-mocks-import
import {
  everyMonthNeverEndingRRule,
  everyDayUntil1June2026RRule,
} from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/__mocks__/config-helpers';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { colors } from '@kitman/common/src/variables';
import {
  addEventRecurrencesForRepeatingEvents,
  emptyRecurrence,
  transformBeRecurrenceToFitFe,
  transformFeRecurrenceRuleToFitBe,
  getIsEditedRecurrenceRuleLessFrequent,
  resetFullCalendarEventState,
  convertTSOEventsToCalendarEvents,
  isNotificationActionable,
} from '../eventUtils';

describe('eventUtils', () => {
  const rruleString = 'FREQ=DAILY';
  const feFullRuleString = `DTSTART:20240319T080000Z\nRRULE:${rruleString}`;
  describe('transformFeRecurrenceRuleToFitBe', () => {
    it.each([
      {
        description: 'strips the DTSTART property',
        input: [RRule.fromString(feFullRuleString)],
        expected: rruleString,
      },
      {
        description: 'returns undefined if there is no rule',
        input: [undefined],
        expected: undefined,
      },
      {
        description: 'handles missing rule.origOptions gracefully',
        input: [
          {
            options: {
              dtstart: new Date('2025-08-04T23:05:00.000Z'),
            },
          },
        ],
        expected: undefined,
      },
      {
        description: 'handles a valid rule correctly',
        input: [
          new RRule({
            freq: 2,
            interval: '1',
            dtstart: new Date('2025-08-05T00:05:00.000Z'),
            count: 5,
            byweekday: [RRule.TU],
          }),
        ],
        expected: 'FREQ=WEEKLY;INTERVAL=1;COUNT=5;BYDAY=TU',
      },
    ])('$description', ({ input, expected }) =>
      expect(transformFeRecurrenceRuleToFitBe(...input)).toBe(expected)
    );
  });

  describe('transformBeRecurrenceToFitFe', () => {
    it('should transform properly - startTime with Z', () => {
      const input = {
        rule: rruleString,
        startTime: '2024-03-19T08:00:00Z',
      };
      expect(transformBeRecurrenceToFitFe(input)).toEqual(feFullRuleString);
    });

    it('should transform properly - startTime without Z', () => {
      const input = {
        rule: rruleString,
        startTime: '2024-03-19T08:00:00',
      };
      expect(transformBeRecurrenceToFitFe(input)).toEqual(feFullRuleString);
    });
  });

  describe('addEventRecurrencesForRepeatingEvents', () => {
    const color = colors.white;
    const firstEventId = 1;
    const secondEventId = 2;
    const eventWithInstancesWithoutEnd = {
      id: firstEventId,
      start: '2024-03-19T08:00:00Z',
      title: '',
      backgroundColor: color,
      borderColor: color,
      type: calendarEventTypeEnumLike.CustomEvent,
      url: `/planning_hub/events/${firstEventId}`,
      recurrence: {
        rrule_instances: [
          '2024-03-19T08:00:00Z',
          '2024-03-20T08:00:00Z',
          '2024-03-21T08:00:00Z',
        ],
        original_start_time: null,
        recurring_event_id: null,
        rule: 'FREQ=DAILY',
      },
      eventCollectionComplete: true,
    };
    const eventWithInstances = {
      ...eventWithInstancesWithoutEnd,
      end: '2024-03-19T09:00:00Z',
    };

    const eventWithoutInstances = {
      id: secondEventId,
      start: '2024-04-19T08:00:00Z',
      end: '2024-04-19T09:00:00Z',
      title: '',
      backgroundColor: color,
      borderColor: color,
      type: calendarEventTypeEnumLike.CustomEvent,
      url: `/planning_hub/events/${secondEventId}`,
      recurrence: { ...emptyRecurrence },
    };

    const transformedRecurrence = {
      ...eventWithInstances.recurrence,
      rule: 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY',
    };

    const input = [eventWithInstances, eventWithoutInstances];

    it('should return early if the repeat-events and repeat-sessions FF is off', () => {
      expect(addEventRecurrencesForRepeatingEvents(input.slice(1))).toEqual([
        {
          ...eventWithoutInstances,
          id: eventWithoutInstances.id.toString(),
          isVirtualEvent: false,
        },
      ]);
    });

    it('should handle start_date and end_date property from EventSwitcherSidePanel and return early', () => {
      expect(
        addEventRecurrencesForRepeatingEvents([
          {
            ...eventWithoutInstances,
            start_date: input.slice(1).start,
            end_date: input.slice(1).end,
          },
        ])
      ).toEqual([
        {
          ...eventWithoutInstances,
          id: eventWithoutInstances.id.toString(),
          isVirtualEvent: false,
        },
      ]);
    });

    describe('with repeat-events or repeat-sessions FF on', () => {
      afterEach(() => {
        window.featureFlags = {};
      });

      it.each([
        {
          ff: 'repeat-events',
          eventType: calendarEventTypeEnumLike.CustomEvent,
        },
        {
          ff: 'repeat-sessions',
          eventType: calendarEventTypeEnumLike.TrainingSession,
        },
      ])('$ff - should transform properly', ({ ff, eventType }) => {
        window.featureFlags[ff] = true;
        const expectedResult = [
          {
            ...eventWithInstances,
            // Parent event (start matches instance start_time)
            id: `${eventWithInstances.id}`,
            start: moment(
              eventWithInstances.recurrence.rrule_instances[0]
            ).format(DateFormatter.dateTransferFormat),
            end: moment('2024-03-19T09:00:00Z').format(
              DateFormatter.dateTransferFormat
            ),
            recurrence: transformedRecurrence,
            eventCollectionComplete: true,
            type: eventType,
            isVirtualEvent: false,
          },
          {
            ...eventWithInstances,
            id: `${eventWithInstances.id}${VIRTUAL_EVENT_ID_SEPARATOR}0`,
            start: moment(
              eventWithInstances.recurrence.rrule_instances[1]
            ).format(DateFormatter.dateTransferFormat),
            end: moment('2024-03-20T09:00:00Z').format(
              DateFormatter.dateTransferFormat
            ),
            recurrence: transformedRecurrence,
            eventCollectionComplete: false,
            type: eventType,
            isVirtualEvent: true,
          },
          {
            ...eventWithInstances,
            id: `${eventWithInstances.id}${VIRTUAL_EVENT_ID_SEPARATOR}1`,
            start: moment(
              eventWithInstances.recurrence.rrule_instances[2]
            ).format(DateFormatter.dateTransferFormat),
            end: moment('2024-03-21T09:00:00Z').format(
              DateFormatter.dateTransferFormat
            ),
            recurrence: transformedRecurrence,
            eventCollectionComplete: false,
            type: eventType,
            isVirtualEvent: true,
          },
          {
            ...eventWithoutInstances,
            id: eventWithoutInstances.id.toString(),
            type: eventType,
          },
        ];

        expect(
          addEventRecurrencesForRepeatingEvents([
            { ...eventWithInstances, type: eventType },
            { ...eventWithoutInstances, type: eventType },
          ])
        ).toEqual(expectedResult);
      });

      it.each([
        {
          ff: 'repeat-events',
          eventType: calendarEventTypeEnumLike.CustomEvent,
        },
        {
          ff: 'repeat-sessions',
          eventType: calendarEventTypeEnumLike.TrainingSession,
        },
      ])(
        '$ff - should ignore recurrences array if end is missing',
        ({ ff, eventType }) => {
          window.featureFlags[ff] = true;
          expect(
            addEventRecurrencesForRepeatingEvents([
              { ...eventWithInstancesWithoutEnd, type: eventType },
              { ...eventWithoutInstances, type: eventType },
            ])
          ).toEqual([
            {
              ...eventWithInstancesWithoutEnd,
              id: eventWithInstancesWithoutEnd.id.toString(),
              recurrence: transformedRecurrence,
              type: eventType,
            },
            {
              ...eventWithoutInstances,
              id: eventWithoutInstances.id.toString(),
              type: eventType,
            },
          ]);
        }
      );
    });
  });

  describe('getIsEditedRecurrenceRuleLessFrequent', () => {
    it('should return true if edited rrule is less frequent', () => {
      const editedRule = everyMonthNeverEndingRRule;
      const currentRule = everyDayUntil1June2026RRule;

      expect(
        getIsEditedRecurrenceRuleLessFrequent(editedRule, currentRule)
      ).toBe(true);
    });

    it('should return false if edited rrule is more frequent', () => {
      const editedRule = everyDayUntil1June2026RRule;
      const currentRule = everyMonthNeverEndingRRule;

      expect(
        getIsEditedRecurrenceRuleLessFrequent(editedRule, currentRule)
      ).toBe(false);
    });

    it('should return true if edited rrule is does not repeat', () => {
      const editedRule = undefined;
      const currentRule = everyMonthNeverEndingRRule;

      expect(
        getIsEditedRecurrenceRuleLessFrequent(editedRule, currentRule)
      ).toBe(true);
    });
  });

  describe('resetFullCalendarEventState', () => {
    const mockRemove = jest.fn();
    const params = {
      fullCalendarEventsFromRedux: [
        { id: 1, title: 'Mock event 1' },
        { id: 2, title: 'Mock event 2' },
        { id: 3, title: 'Mock event 3' },
      ],
      fullCalendarEventId: 1,
      fullCalendarApi: {
        getEventById: jest.fn().mockReturnValue({ remove: mockRemove }),
        addEvent: jest.fn(),
      },
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call full calendar api to add remove and add events if initialEvent exists', () => {
      resetFullCalendarEventState(params);
      expect(params.fullCalendarApi.addEvent).toHaveBeenCalledWith({
        id: 1,
        title: 'Mock event 1',
      });
      expect(mockRemove).toHaveBeenCalled();
    });

    it('should not call full calendar api to add remove and add events if initialEvent does not exist', () => {
      resetFullCalendarEventState({
        ...params,
        fullCalendarEventsFromRedux: [],
      });
      expect(params.fullCalendarApi.addEvent).not.toHaveBeenCalled();
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });

  describe('convertTSOEventsToCalendarEvents', () => {
    it('should convert TSOEvent to CalendarEventBeforeFullCalendar', () => {
      const tsoEvents = [
        {
          Id: 123,
          KitmanTeamId: 456,
          StartDate: '2025-11-01T08:00:00Z',
          EndDate: '2025-11-02T08:00:00Z',
          Name: 'Sample Event',
          Description: 'This is a sample event',
          Team: {
            Id: 789,
            Name: 'Sample Team',
            Order: 1,
            ClubId: 1,
            Club: 'Sample Club',
            OptaTeamId: 101,
            IsFirstTeam: true,
            TeamType: 1,
            IsHiddenFromClub: false,
          },
          IsShared: true,
        },
      ];

      const expectedCalendarEvents = [
        {
          id: '123',
          start: '2025-11-01T08:00:00Z',
          end: '2025-11-02T08:00:00Z',
          title: 'Sample Event',
          description: 'This is a sample event',
          url: '/events_management',
          type: 'EVENT',
          backgroundColor: colors.teal_300,
          borderColor: colors.teal_300,
          allDay: true, // duration is 1 day
          recurrence: emptyRecurrence,
          squad: {
            id: 456,
            name: '',
          },
        },
      ];

      const result = convertTSOEventsToCalendarEvents(tsoEvents);

      expect(result).toEqual(expectedCalendarEvents);
    });
  });

  describe('isNotificationActionable', () => {
    const defaultTriggers = [
      {
        area: 'event',
        enabled_channels: {
          athlete: ['push'],
          staff: [],
        },
      },
      {
        area: 'other_area',
        enabled_channels: {
          athlete: [],
          staff: ['email'],
        },
      },
    ];

    it('should return true if event channels are provided and have athletes', () => {
      const eventChannels = { athlete: ['email'], staff: [] };
      expect(isNotificationActionable(defaultTriggers, eventChannels)).toBe(
        true
      );
    });

    it('should return true if event channels are provided and have staff', () => {
      const eventChannels = { athlete: [], staff: ['push'] };
      expect(isNotificationActionable(defaultTriggers, eventChannels)).toBe(
        true
      );
    });

    it('should return false if event channels are provided but empty', () => {
      const eventChannels = { athlete: [], staff: [] };
      expect(isNotificationActionable(defaultTriggers, eventChannels)).toBe(
        false
      );
    });

    it('should fallback to default triggers if event channels are null/undefined', () => {
      // Default trigger for 'event' has athletes enabled
      expect(isNotificationActionable(defaultTriggers, null)).toBe(true);
    });

    it('should return false if fallback to default triggers happens but they are empty', () => {
      const emptyTriggers = [
        {
          area: 'event',
          enabled_channels: { athlete: [], staff: [] },
        },
      ];
      expect(isNotificationActionable(emptyTriggers, null)).toBe(false);
    });

    it('should return false if no event channels and no matching default trigger found', () => {
      const noEventTriggers = [
        {
          area: 'other',
          enabled_channels: { athlete: ['push'], staff: [] },
        },
      ];
      expect(isNotificationActionable(noEventTriggers, null)).toBe(false);
    });

    it('should return false if inputs are null/undefined', () => {
      expect(isNotificationActionable(null, null)).toBe(false);
      expect(isNotificationActionable(undefined, undefined)).toBe(false);
    });
  });
});
