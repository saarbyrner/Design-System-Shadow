import 'core-js/stable/structured-clone';

import moment from 'moment/moment';
import {
  createInitialEvent,
  createInitialValidation,
  isEventDateInFuture,
  sanitizeEvent,
} from '../utils';
import { StaffVisibilityOptions } from '../components/custom/utils';

describe('utils', () => {
  beforeEach(() => {
    moment.tz.setDefault('Europe/Dublin');
    Date.now = jest.fn(() => new Date('2021-04-24T00:00:00+01:00'));
  });

  afterEach(() => {
    // we must clean up when tampering with globals.
    moment.tz.setDefault();
    Date.now = new Date();
  });

  describe('sanitizeEvent', () => {
    it('removes score and opponent_score for future game events', () => {
      const futureEvent = {
        type: 'game_event',
        local_timezone: 'Europe/Dublin',
        start_time: '2024-04-20T07:00:48Z',
        score: '1',
        opponent_score: '2',
      };

      const pastEvent = {
        type: 'game_event',
        local_timezone: 'Europe/Dublin',
        start_time: '2020-04-20T07:00:48Z',
        score: '1',
        opponent_score: '2',
      };

      const result1 = sanitizeEvent(futureEvent);
      expect(result1.score).toBe(undefined);
      expect(result1.opponent_score).toBe(undefined);

      const result2 = sanitizeEvent(pastEvent);
      expect(result2.score).toBe('1');
      expect(result2.opponent_score).toBe('2');
    });

    it('ensure game day +- are positive numbers', () => {
      const sessionEvent = {
        type: 'session_event',
        local_timezone: 'Europe/Dublin',
        start_time: '2024-04-20T07:00:48Z',
        duration: '20',
        game_day_minus: -1,
        game_day_plus: -7,
      };
      const result1 = sanitizeEvent(sessionEvent);
      expect(result1.game_day_minus).toBe(1);
      expect(result1.game_day_plus).toBe(7);
    });
  });

  describe('isEventDateInFuture', () => {
    it('returns true if events are in the future', () => {
      const pastEvent = {
        local_timezone: 'Europe/Dublin',
        start_time: '2020-04-20T07:00:48Z',
      };

      expect(isEventDateInFuture(pastEvent)).toEqual(false);

      const futureEvent = {
        local_timezone: 'Europe/Dublin',
        start_time: '2022-04-20T07:00:48Z',
      };

      expect(isEventDateInFuture(futureEvent)).toEqual(true);
    });
  });

  describe('createInitialEvent', () => {
    const expectedInitialEventProps = {
      title: '',
      editable: true,
      start_time: '2021-04-24T00:00:00+01:00',
      duration: 90,
      local_timezone: 'Europe/Dublin',
      athlete_ids: [],
      user_ids: [],
    };
    it('can return a session type event', () => {
      const event = createInitialEvent(false, 'session_event', 20, 90);

      expect(event.type).toEqual('session_event');
      expect(event.title).toEqual('');
      expect(event.workload_type).toEqual(1);
      expect(event.start_time).toEqual('2021-04-24T00:00:00+01:00');
      expect(event.duration).toEqual(20);
      expect(event.local_timezone).toEqual('Europe/Dublin');

      // Default is session
      const event2 = createInitialEvent(false, undefined, 10, 90);
      expect(event2.type).toEqual('session_event');
      expect(event2.duration).toEqual(10);
    });

    it('can return a game type event', () => {
      const event = createInitialEvent(false, 'game_event', 5, 90);

      expect(event.type).toEqual('game_event');
      expect(event.title).toEqual('');
      expect(event.turnaround_prefix).toEqual('');
      expect(event.turnaround_fixture).toEqual(true);
      expect(event.start_time).toEqual('2021-04-24T00:00:00+01:00');
      expect(event.duration).toEqual(90);
      expect(event.local_timezone).toEqual('Europe/Dublin');
    });

    it('can return a custom event', () => {
      const event = createInitialEvent(false, 'custom_event', 90);

      expect(event).toEqual({
        type: 'custom_event',
        ...expectedInitialEventProps,
      });
    });

    it('can return a custom event with default visibility when FF is on', () => {
      window.featureFlags['staff-visibility-custom-events'] = true;

      const event = createInitialEvent(false, 'custom_event', 90);
      expect(event).toEqual({
        type: 'custom_event',
        staff_visibility: StaffVisibilityOptions.allStaff,
        visibility_ids: [],
        ...expectedInitialEventProps,
      });

      window.featureFlags['staff-visibility-custom-events'] = false;
    });
  });

  describe('createInitialValidation', () => {
    it('can return a session type validation', () => {
      const validation = createInitialValidation('session_event');
      expect(validation.type).toEqual('session_event');

      // Default is session
      const validation2 = createInitialValidation();
      expect(validation2.type).toEqual('session_event');
    });

    it('can return a game type validation', () => {
      const validation = createInitialValidation('game_event');
      expect(validation.type).toEqual('game_event');
    });
  });
});
