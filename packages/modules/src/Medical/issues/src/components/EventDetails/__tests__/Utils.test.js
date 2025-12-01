import { nonInfoEventTypes } from '@kitman/modules/src/Medical/shared/utils';
import { isOtherClassedEvent, getEventId } from '../Utils';

describe('isOtherClassedEvent', () => {
  it('should return true for "other" event type', () => {
    expect(isOtherClassedEvent('other')).toBe(true);
  });

  it('should return true for event types in nonInfoEventTypes', () => {
    nonInfoEventTypes.forEach((eventType) => {
      expect(isOtherClassedEvent(eventType)).toBe(true);
    });
  });

  it('should return true for event types in nonInfoEventTypes regardless of case', () => {
    nonInfoEventTypes.forEach((eventType) => {
      expect(isOtherClassedEvent(eventType.toUpperCase())).toBe(true);
    });
  });

  it('should return false for other event types not in nonInfoEventTypes', () => {
    expect(isOtherClassedEvent('training')).toBe(false);
    expect(isOtherClassedEvent('game')).toBe(false);
    expect(isOtherClassedEvent('injury')).toBe(false);
  });
});

describe('getEventId', () => {
  it('should return game_id if present', () => {
    const issue = { game_id: 123, training_session_id: 456 };
    expect(getEventId(issue)).toBe(123);
  });

  it('should return training_session_id if game_id is not present', () => {
    const issue = { training_session_id: 456 };
    expect(getEventId(issue)).toBe(456);
  });

  it('should return null if neither game_id nor training_session_id are present and activity_type is null', () => {
    const issue = { activity_type: null };
    expect(getEventId(issue)).toBe(null);
  });

  it('should return an empty string if activity_type is present and isOtherClassedEvent returns true', () => {
    const issue = { activity_type: 'other' };
    expect(getEventId(issue)).toBe('');
  });

  it('should return an empty string if activity_type is present and isOtherClassedEvent returns false (unlisted)', () => {
    const issue = { activity_type: 'training' };
    expect(getEventId(issue)).toBe('');
  });

  it('should return an empty string if activity_type is present and isOtherClassedEvent returns true (from nonInfoEventTypes)', () => {
    const issue = { activity_type: nonInfoEventTypes[0] }; // Use one of the actual nonInfoEventTypes
    expect(getEventId(issue)).toBe('');
  });
});
