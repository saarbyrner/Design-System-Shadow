// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

// Types
import type { DateRange, DateRangeMUI } from '@kitman/common/src/types';

export const getDateRangeForToday = (): DateRange => {
  const now = moment();
  return {
    start_date: now.startOf('day').format(DateFormatter.dateTransferFormat),
    end_date: now.endOf('day').format(DateFormatter.dateTransferFormat),
  };
};

const INFINITY_PLACEHOLDER = 8.64e14;

// Constants for infinity values
const NEGATIVE_INFINITY_DATE = moment(-INFINITY_PLACEHOLDER);
const POSITIVE_INFINITY_DATE = moment(INFINITY_PLACEHOLDER);
/**
 * Function to check if a date falls within any of the date ranges
 * @param {moment.Moment} date - The date to be checked.
 * @param {Array<DateRangeMUI>} dateRanges - List of date range objects with 'start' and 'end' parameters.
 * @returns {boolean} - Returns true if the date falls within any of the date ranges, otherwise false.
 */
export const isDateInRange = (
  date: moment.Moment,
  dateRanges: Array<DateRangeMUI>
): boolean => {
  return dateRanges.some((range) => {
    const startDate = range.start
      ? moment(range.start)
      : NEGATIVE_INFINITY_DATE;
    const endDate = range.end ? moment(range.end) : POSITIVE_INFINITY_DATE;
    return date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate);
  });
};
