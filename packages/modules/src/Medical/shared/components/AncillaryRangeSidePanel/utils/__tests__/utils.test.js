import moment from 'moment';
import {
  shouldDisableDateInAncillaryRangeAdd,
  doesListOfRangesContainAValidRange,
} from '..';
import { MOVEMENT_ENUM_LIKE } from '../../types';

describe('shouldDisableDateInAncillaryRangeAdd', () => {
  const eligibleRanges = {
    eligible_ranges: [
      { start: moment('2023-01-01'), end: moment('2023-12-31') },
    ],
  };

  test('should return true if the date is not in the eligible range', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2024-01-01'),
      position: 'start',
      dateRange: [],
      eligibleRanges,
    });
    expect(result).toBe(true);
  });

  test('should return false if the date is in the eligible range and position is start', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-06-15'),
      position: 'start',
      dateRange: [],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.tryout,
    });
    expect(result).toBe(false);
  });

  test('should return false if there is no start date in dateRange', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-06-15'),
      position: 'end',
      dateRange: [null, null],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.tryout,
    });
    expect(result).toBe(false);
  });

  test('should return true if the end date is more than 6 days after start date for tryout', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-06-15'),
      position: 'end',
      dateRange: [moment('2023-06-08'), null],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.tryout,
    });
    expect(result).toBe(true);
  });

  test('should return false if the end date is within 6 days after start date for tryout', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-06-12'),
      position: 'end',
      dateRange: [moment('2023-06-08'), null],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.tryout,
    });
    expect(result).toBe(false);
  });

  test('should return true if the end date is more than 179 days after start date for continuousCare', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-12-15'),
      position: 'end',
      dateRange: [moment('2023-06-15'), null],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.continuousCare,
    });
    expect(result).toBe(true);
  });

  test('should return false if the end date is within 179 days after start date for continuousCare', () => {
    const result = shouldDisableDateInAncillaryRangeAdd({
      day: moment('2023-12-10'),
      position: 'end',
      dateRange: [moment('2023-06-15'), null],
      eligibleRanges,
      movementTypeValue: MOVEMENT_ENUM_LIKE.continuousCare,
    });
    expect(result).toBe(false);
  });
});

describe('doesListOfRangesContainAValidRange', () => {
  const eligibleRanges = {
    eligible_ranges: [
      { start: moment('2023-01-01'), end: moment('2023-12-31') },
      { start: null, end: moment('2022-10-01') },
    ],
  };

  test('should return true for a range with no disabled days', () => {
    const startDate = moment('2023-06-08');
    const endDate = moment('2023-06-10');

    const result = doesListOfRangesContainAValidRange({
      startDate,
      endDate,
      eligibleRanges,
    });

    expect(result).toBe(true);
  });

  test('should return false for a range with disabled days', () => {
    const startDate = moment('2023-06-08');
    const endDate = moment('2024-06-15'); // this value is outside eligible_range end

    const result = doesListOfRangesContainAValidRange({
      startDate,
      endDate,
      eligibleRanges,
    });

    expect(result).toBe(false);
  });
});
