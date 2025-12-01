// @flow
import moment from 'moment';

const millisecondsInADay = 86400000; // 24 * 60 * 60 * 1000

/**
 * Function that calculates and returns an array of all days between two dates.
 *
 * @param {Date} startDate data to be processed
 * @param {Date} endDate data to be processed
 * @returns Array<Date>
 */
export const getDatesBetween = (
  startDate: Date,
  endDate: Date
): Array<Date> => {
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const days =
    Math.round((end.getTime() - start.getTime()) / millisecondsInADay) + 1;

  return Array.from({ length: days }, (_, index) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + index);
    return newDate;
  });
};

/**
 * Function that calculates and returns an array of the start dates of each week between two dates
 *s
 * @param {Date} startDate data to be processed
 * @param {Date} endDate data to be processed
 * @returns Array<Date>
 */
export const getWeeksBetween = (startDate: Date, endDate: Date) => {
  const current = moment(startDate);
  const end = moment(endDate);
  const weeks = [];

  // while the current date is before/same as end date
  while (current.isSameOrBefore(end, 'day')) {
    // check if current date is a the same as the isoWeekday (start of the week)
    if (current.day() === moment().isoWeekday(0)) {
      weeks.push(current.toDate());
    } else {
      // when current is not an isoWeekday, get the start date of the week
      weeks.push(current.startOf('isoWeek').toDate());
    }

    current.add(1, 'week');
  }

  return weeks;
};

/**
 * Function that calculates and returns an array of the start dates of each month between two dates
 *
 * @param {Date} startDate data to be processed
 * @param {Date} endDate data to be processed
 * @returns Array<Date>
 */
export const getMonthsBetween = (startDate: Date, endDate: Date) => {
  // get start of month for startDate and endDate
  const current = moment(startDate).startOf('month');
  const end = moment(endDate).startOf('month');
  const months = [];

  // while the current date is before/same as end date
  while (current.isSameOrBefore(end, 'day')) {
    // push start of the month date
    months.push(current.clone().toDate());

    current.add(1, 'month').startOf('month');
  }

  return months;
};
