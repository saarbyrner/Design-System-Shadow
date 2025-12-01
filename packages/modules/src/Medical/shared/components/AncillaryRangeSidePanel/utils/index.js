// @flow
import moment from 'moment';
import { isDateInRange } from '@kitman/common/src/utils/dateRange';
import type { EligibleRanges } from '@kitman/services/src/services/medical/getAncillaryEligibleRanges';
import { MOVEMENT_ENUM_LIKE } from '../types';
import type { POSITION_TYPE, MOVEMENT_TYPE, MOMENT_DATE_RANGE } from '../types';

/**
 * @name shouldDisableDateInAncillaryRangeAdd
 * Determines if a given date should be disabled based on its position within a date range,
 * eligibility of the date, and movement type.
 *
 * @param {Object} params - The parameters for the function.
 * @param {moment.Moment} params.day - The date to check.
 * @param {POSITION_TYPE} params.position - The position in the date range ('start' or 'end').
 * @param {MOMENT_DATE_RANGE} params.dateRange - The date range array with start and end dates.
 * @param {EligibleRanges} params.eligibleRanges - The ranges of eligible dates.
 * @param {MOVEMENT_TYPE} params.movementTypeValue - The type of movement (e.g., tryout, continuousCare).
 *
 * @returns {boolean} - Returns true if the date should be disabled, false otherwise.
 *
 */
export const shouldDisableDateInAncillaryRangeAdd = ({
  day,
  position,
  dateRange,
  eligibleRanges,
  movementTypeValue,
}: {
  day: moment.Moment,
  position: POSITION_TYPE,
  dateRange: MOMENT_DATE_RANGE,
  eligibleRanges: EligibleRanges,
  movementTypeValue: MOVEMENT_TYPE,
}) => {
  if (!isDateInRange(day, eligibleRanges.eligible_ranges)) {
    return true;
  }
  if (!dateRange[0]) return false;

  const [start] = dateRange;
  if (position === 'start') {
    return false;
  }
  if (position === 'end') {
    if (movementTypeValue === MOVEMENT_ENUM_LIKE.tryout) {
      // 6 because we're including the start day
      return start && day.diff(start, 'days') > 6;
    }
    if (movementTypeValue === MOVEMENT_ENUM_LIKE.continuousCare) {
      // 179 because we're including the start day
      return start && day.diff(start, 'days') > 179;
    }
  }

  return false;
};

/**
Checks if a range of dates should be disabled based on eligibility criteria.
This is useful for validating date ranges to ensure they do not include
any dates that are considered ineligible or restricted.
 *
@param {Object} params - The parameters for the function.
@param {moment.Moment} params.startDate - The start date of the range.
@param {moment.Moment} params.endDate - The end date of the range.
@param {EligibleRanges} params.eligibleRanges - An object containing an array of eligible date ranges.
 *
@returns {boolean} - Returns false if any date in the range should be disabled, true otherwise.
 *
 */
export const doesListOfRangesContainAValidRange = ({
  startDate,
  endDate,
  eligibleRanges,
}: {
  startDate: moment.Moment,
  endDate: moment.Moment,
  eligibleRanges: EligibleRanges,
}): boolean => {
  return eligibleRanges.eligible_ranges.some(({ start, end }) => {
    const isStartDateBeforeRangeStart = startDate?.isBefore(start);
    const isEndDateAfterRangeEnd = endDate?.isAfter(end);

    return !isStartDateBeforeRangeStart && !isEndDateAfterRangeEnd;
  });
};
