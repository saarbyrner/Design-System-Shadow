import structuredClone from 'core-js/stable/structured-clone';

import { getEventsWithRecurringEvents } from '../utils';

describe('utils', () => {
  describe('getEventsWithRecurringEvents', () => {
    const baseEvent = {
      id: 1,
      type: 'custom_event',
      recurrence: {
        rule: 'FREQ=DAILY',
        rrule_instances: [
          '20240516T102431Z',
          '20240517T102431Z',
          '20240518T102431Z',
        ],
      },
      start_date: '2024-05-16T10:24:31Z',
      end_date: '2024-05-16T10:24:31Z',
    };

    [
      {
        featureName: 'repeat events',
        flags: ['repeat-events', 'custom-events'],
        eventType: 'custom_event',
      },
      {
        featureName: 'repeat sessions',
        flags: ['repeat-sessions'],
        eventType: 'session_event',
      },
    ].forEach(({ featureName, flags, eventType }) => {
      it.each([
        {
          description: `doesn’t modify events if ${featureName} feature flag isn’t on'`,
          flags: [],
          input: [{ ...baseEvent, type: eventType }],
          expected: [{ ...baseEvent, type: eventType }],
        },
        {
          description: `doesn’t modify events if ${featureName} feature flag is on and' +
            ' event.type isn’t ${eventType}`,
          flags,
          input: [{ ...baseEvent, type: 'event_type' }],
          expected: [{ ...baseEvent, type: 'event_type' }],
        },
        {
          description: `doesn’t modify events if ${featureName} feature flag is on and' +
            ' event.recurrence is falsy`,
          flags,
          input: [{ ...baseEvent, type: eventType, recurrence: null }],
          expected: [{ ...baseEvent, type: eventType, recurrence: null }],
        },
        {
          description:
            'doesn’t append ‘DTSTART’ property to `event.recurrence.rule` if' +
            ` ${featureName} feature flag is on and` +
            ' event.recurrence.rrule_instances is falsy',
          flags,
          input: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                rule: baseEvent.recurrence.rule,
                rrule_instances: null,
              },
            },
          ],
          expected: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                rule: baseEvent.recurrence.rule,
                rrule_instances: null,
              },
            },
          ],
        },
        {
          description:
            'doesn’t append ‘DTSTART’ property to `event.recurrence.rule` if' +
            ` ${featureName} feature flag is on and` +
            ' event.recurrence.rrule_instances.length is 0',
          flags,
          input: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                rule: baseEvent.recurrence.rule,
                rrule_instances: [],
              },
            },
          ],
          expected: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                rule: baseEvent.recurrence.rule,
                rrule_instances: [],
              },
            },
          ],
        },
        {
          description:
            'doesn’t append ‘DTSTART’ property to `event.recurrence.rule` if' +
            ` ${featureName} feature flag is on and` +
            ' event.recurrence.rule is falsy',
          flags,
          input: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                ...baseEvent.recurrence,
                rule: '',
              },
            },
          ],
          expected: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                ...baseEvent.recurrence,
                rule: '',
              },
            },
          ],
        },
        {
          description: `returns the passed events with the repeated events for ${featureName}`,
          input: [structuredClone({ ...baseEvent, type: eventType })],
          flags,
          expected: [
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                ...baseEvent.recurrence,
                rule: 'FREQ=DAILY;DTSTART=20240516',
              },
              reactKey: '1VIRTUAL_EVENT1',
              start_date: '2024-05-18T10:24:31+00:00',
            },
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                ...baseEvent.recurrence,
                rule: 'FREQ=DAILY;DTSTART=20240516',
              },
              reactKey: '1VIRTUAL_EVENT0',
              start_date: '2024-05-17T10:24:31+00:00',
            },
            {
              ...baseEvent,
              type: eventType,
              recurrence: {
                ...baseEvent.recurrence,
                rule: 'FREQ=DAILY;DTSTART=20240516',
              },
              reactKey: '1',
              start_date: '2024-05-16T10:24:31+00:00',
            },
          ],
        },
      ])('$description', ({ flags: flagsToSet, input, expected }) => {
        flagsToSet.forEach((f) => {
          window.featureFlags[f] = true;
        });

        expect(getEventsWithRecurringEvents(input)).toEqual(expected);

        flagsToSet.forEach((f) => {
          window.featureFlags[f] = false;
        });
      });
    });
  });
});
