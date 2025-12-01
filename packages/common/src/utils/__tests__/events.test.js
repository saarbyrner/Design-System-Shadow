import {
  getIsRepeatableEvent,
  getIsRepeatEvent,
  getHumanReadableEventType,
  HUMAN_READABLE_EVENT_TYPE,
} from '../events';

describe('events', () => {
  describe('getIsRepeatEvent', () => {
    afterEach(() => {
      window.featureFlags = {};
    });

    describe('repeat-events', () => {
      it.each([
        {
          description:
            'returns `true` if `event.recurrence.rule` is truthy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ and ‘repeat-events’ feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: { type: 'custom_event', recurrence: { rule: 'rule' } },
          expected: true,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is truthy, `event.type` isn’t' +
            ' ‘custom_event’, and ‘custom-events’ and ‘repeat-events’ feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: { type: 'type', recurrence: { rule: 'rule' } },
          expected: false,
        },
        {
          description:
            'returns `true` if `checkHasRecurrence` is falsy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ and ‘repeat-events’ feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: { type: 'custom_event', recurrence: undefined },
          expected: false,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is falsy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ and ‘repeat-events’ feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: { type: 'custom_event', recurrence: { rule: '' } },
          expected: false,
        },
        {
          description:
            'returns `false` if `event.recurrence` is falsy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ and ‘repeat-events’ feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: { type: 'custom_event', recurrence: null },
          expected: false,
        },
        {
          description:
            'returns `false` if `event` is falsy and ‘custom-events’ and ‘repeat-events’' +
            ' feature flags are on',
          flags: ['custom-events', 'repeat-events'],
          event: null,
          expected: false,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is truthy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ feature flag is off and ‘repeat-events’' +
            ' feature flags is on',
          flags: ['repeat-events'],
          event: { type: 'custom_event', recurrence: { rule: 'rule' } },
          expected: false,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is truthy, `event.type` is' +
            ' ‘custom_event’, and ‘custom-events’ feature flag is on and ‘repeat-events’' +
            ' feature flags is off',
          flags: ['custom-events'],
          event: { type: 'custom_event', recurrence: { rule: 'rule' } },
          expected: false,
        },
        {
          description:
            'returns `true` if `event.recurrence.rule` is truthy, `event.type` is' +
            ' ‘session_event’, and ‘repeat-sessions’ feature flag is on',
          flags: ['custom-events'],
          event: { type: 'custom_event', recurrence: { rule: 'rule' } },
          expected: false,
        },
      ])(
        '$description',
        (
          { flags, event, expected, checkHasRecurrence } = {
            checkHasRecurrence: true,
          }
        ) => {
          flags.forEach((f) => {
            window.featureFlags[f] = true;
          });

          expect(getIsRepeatEvent(event, checkHasRecurrence)).toBe(expected);
        }
      );
    });

    describe('repeat-sessions', () => {
      it.each([
        {
          description:
            'returns `true` if `event.recurrence.rule` is truthy, `event.type` is' +
            '‘session_event’, and ‘repeat-sessions’ feature flag is on',
          flags: ['repeat-sessions'],
          event: { type: 'session_event', recurrence: { rule: 'rule' } },
          expected: true,
        },
        {
          description:
            'returns `true` if `checkHasRecurrence` is falsy, `event.type` is' +
            '‘session_event’, and ‘repeat-sessions’ feature flag is on',
          flags: ['repeat-sessions'],
          event: { type: 'session_event', recurrence: undefined },
          expected: true,
          checkHasRecurrence: false,
        },
        {
          description:
            'returns `true` if `checkHasRecurrence` is falsy, `event.type` is' +
            '‘training_session’, and ‘repeat-sessions’ feature flag is on',
          flags: ['repeat-sessions'],
          event: { type: 'training_session', recurrence: undefined },
          expected: true,
          checkHasRecurrence: false,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is truthy, `event.type` is' +
            '‘session_event’, and ‘repeat-sessions’ feature flag is off',
          flags: [],
          event: { type: 'session_event', recurrence: { rule: 'rule' } },
          expected: false,
        },
        {
          description:
            'returns `false` if `event.recurrence.rule` is falsy, `event.type` is' +
            '‘session_event’, and ‘repeat-sessions’ feature flag is on',
          flags: ['repeat-sessions'],
          event: { type: 'session_event', recurrence: undefined },
          expected: false,
        },
      ])(
        '$description',
        (
          { flags, event, expected, checkHasRecurrence } = {
            checkHasRecurrence: true,
          }
        ) => {
          flags.forEach((f) => {
            window.featureFlags[f] = true;
          });

          expect(getIsRepeatEvent(event, checkHasRecurrence)).toBe(expected);
        }
      );
    });
  });

  describe('getHumanReadableEventType', () => {
    it.each([
      {
        description: 'returns ‘Game’ by default',
        event: {},
        expected: HUMAN_READABLE_EVENT_TYPE.Game,
      },
      {
        description: 'returns ‘Game’ if `event.type` is ‘game_event’',
        event: { type: 'game_event' },
        expected: HUMAN_READABLE_EVENT_TYPE.Game,
      },
      {
        description: 'returns ‘Session’ if `event.type` is ‘session_event’',
        event: { type: 'session_event' },
        expected: HUMAN_READABLE_EVENT_TYPE.Session,
      },
      {
        description: 'returns ‘Event’ if `event.type` is ‘custom_event’',
        event: { type: 'custom_event' },
        expected: HUMAN_READABLE_EVENT_TYPE.Event,
      },
    ])('$description', ({ event, expected }) => {
      expect(getHumanReadableEventType(event)).toBe(expected);
    });
  });

  describe('getIsRepeatableEvent', () => {
    it('should return false for null value', () => {
      expect(getIsRepeatableEvent(null)).toBe(false);
    });

    it('should return false for game_event', () => {
      expect(getIsRepeatableEvent('game_event')).toBe(false);
    });

    it('should return true for custom_event', () => {
      expect(getIsRepeatableEvent('custom_event')).toBe(true);
    });

    it('should return true for session_event', () => {
      expect(getIsRepeatableEvent('session_event')).toBe(true);
    });
  });
});
