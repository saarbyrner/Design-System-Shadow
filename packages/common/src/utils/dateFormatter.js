// @flow
import moment from 'moment';

export const dateTransferFormat = 'YYYY-MM-DDTHH:mm:ssZ';
export const defaultFormat = 'll';

/**
 * Moment to a short  date string format
 * If you don't show the year then we are hardcoding the format which is not desired.
 * Only do this where extreme space saving needed but formatVeryShort output won't do
 *
 * @param  {moment} date The moment to format
 * @param  {string} locale E.g. 'en-US'
 * @param  {boolean} showYear Ideally do show the year as will be locale adapted then
 * @return {string} Date Output e.g. 'Sun, Feb 19' or 'Tue, Mar 2'
 */
export const formatShortOrgLocale = (
  date: moment,
  locale: ?string,
  showYear: boolean = true
): string => {
  if (!date || !date.isValid()) {
    return '';
  }

  // This is the safer locale compliant option (ll)
  if (showYear) {
    return date.format('ddd ll');
  }

  if (
    locale?.toLowerCase() === 'en-us' ||
    (!locale && date.locale()?.toLowerCase() === 'en-us')
  ) {
    return date.format('ddd, MMM D');
  }

  // This is not an locale adaptive format
  return date.format('ddd D MMM');
};

/**
 * Moment to short locale appropriate date string format
 * Use ONLY where horizontal space is minimal. Column headers in dense tables. Graph labels.
 *
 * @param  {moment} date The moment to format
 * @return {string} Date Output e.g. 02/10/2021
 */
export const formatShort = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format('L');
};

/**
 * Moment to shortest locale appropriate date string format
 * Use ONLY where horizontal space is minimal. Column headers in dense tables. Graph labels.
 * @param  {moment} date The moment to format
 * @return {string} Date Output e.g. 2/10/2021
 */
export const formatVeryShort = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format('l');
};

/**
 * Moment to a locale appropriate time string format
 * Use when referring to just the time of an event; time an injury occurred, time of a game etc
 * @param  {moment} date The moment to format
 * @param  {boolean} showSeconds Also output seconds ( default false)
 * @return {string} Locale Time Output e.g. 1.01 PM , or 13:01 with seconds or not
 */
export const formatJustTime = (
  date: moment,
  showSeconds: boolean = false
): string => {
  if (!date || !date.isValid()) {
    return '';
  }

  if (showSeconds) {
    return date.format('LTS');
  }

  return date.format('LT');
};

/**
 * Moment to a locale appropriate time string format of a 12 hour clock with the appropriate AM/PM suffix
 * @param  {moment} date The moment to format
 * @return {string} Time Output e.g. 01:01 AM or 01:01 PM
 */
export const formatJustTimeWithAMPM = (date: moment): string =>
  date.format('hh:mm A');

/**
 * Moment to a locale appropriate string format
 * Use when referring to the date of an event; day an injury occurred, day of a game etc
 * @param {moment} date The moment to format
 * @param {boolean} showTime Also output the time to minutes
 * @param {boolean} showCompleteDate Also output the week day plus the time to minutes: 'Wednesday, February 24, 2021 12:00 AM'
 * @param {boolean} displayLongDate Output long: 'Wednesday, February 24, 2021 12:00 AM'. If is not set, output short: 'Wed, Feb 24, 2021 12:00 AM'
 * @param {boolean} showTimezone It appends the user timezone at the end of the date
 * @return {string} Date Output short = 'Feb 24, 2021' or long = 'Febuary 24, 2021'
 */
export const formatStandard = ({
  date,
  showTime,
  showCompleteDate,
  displayLongDate,
  showTimezone,
}: {|
  date: moment,
  showTime?: boolean,
  showCompleteDate?: boolean,
  displayLongDate?: boolean,
  showTimezone?: boolean,
|}): string => {
  if (!date || !date.isValid()) {
    return '';
  }

  let format = displayLongDate ? 'LL' : 'll';

  if (showTime) format = displayLongDate ? 'LLL' : 'lll';
  if (showCompleteDate) format = displayLongDate ? 'LLLL' : 'llll';
  if (showTimezone) format += ' z';

  return date.format(format);
};

/**
 * Moment to a locale appropriate string format
 * Returns full day name, full date and year
 */
export const dayDateYear = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }

  return `${moment(date).format('dddd LL')}`;
};

/**
 * Moment to a locale appropriate string format
 * Returns either a single date in the format [startTime] - [endTime], [date]
 * or when the date is spanning multiple days it returns [startTime], [date1] - [endTime], [date2]
 */
const multiDateFormatter = (
  date: moment,
  endTime: moment,
  isSameDay: boolean
): string => {
  const formattedDateStart = dayDateYear(date);
  const formattedDateEnd = dayDateYear(endTime);
  const formatetdTimeStart = formatJustTime(date, false);
  const formatetdTimeEnd = formatJustTime(endTime, false);

  const singleDateDisplay = `${formatetdTimeStart} - ${formatetdTimeEnd}, ${formattedDateStart} `;
  const multiDateDisplay = `${formatetdTimeStart}, ${formattedDateStart} - ${formatetdTimeEnd}, ${formattedDateEnd} `;

  return isSameDay ? singleDateDisplay : multiDateDisplay;
};

/**
 * Moment to a locale appropriate string format based on time passed to the current time
 * Use when a user has performed a historical action within the system; added a note, edited an injury, imported data etc.
 * @param  {moment} date The moment to format
 * @return {string} Date Output based on magnitude time passed: E.g. '23 minutes ago', 'Today at 15:41', 'Yesterday at 15:41', 'Feb 24, 2021 15:41', 'Feb 24, 2020'
 */
export const formatRelativeToNow = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }

  const minutesAgo = moment().diff(date, 'minutes');
  if (minutesAgo < 60) {
    return date.fromNow();
  }
  if (minutesAgo < 1440 * 7) {
    // Less than 7 days of minutes
    return date.calendar();
  }
  if (minutesAgo < 1440 * 365) {
    // Less than 365 days of minutes
    return date.format('lll');
  }
  // 365 or more days of minutes
  return date.format('ll');
};

// When displaying a date range comprising of a start and end date
/**
 * Moment range to a locale appropriate string format based on time passed to the current time
 * Use when a user has performed a historical action within the system; added a note, edited an injury, imported data etc.
 * @param  {moment} startDate The earlier date
 * @param  {moment} endDate The more recent date
 * @return {string} Date Output. 'Feb 24, 2021 - Mar 1, 2021' or if startDate and endDate are the same day: 'Mar 1, 2021'
 */
export const formatRange = (
  startDate: moment,
  endDate: moment,
  multiDateFormat: ?boolean
): string => {
  if (!startDate || !startDate.isValid()) {
    return '';
  }

  if (!endDate || !endDate.isValid()) {
    return '';
  }

  const isSameDay = startDate.isSame(endDate, 'day');
  if (multiDateFormat) {
    return multiDateFormatter(startDate, endDate, isSameDay);
  }
  if (isSameDay) {
    return startDate.format('ll');
  }

  return `${startDate.format('ll')} - ${endDate.format('ll')}`;
};

/**
 * Moment to two digit year
 *
 * @param  {moment} date The moment to format
 * @return {string} Date format input 02/10/2021 -> Output e.g. 21
 */
export const formatTwoDigitYear = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format('YY');
};

/**
 * Moment to date and time friendly string
 *
 * @param  {moment} date The moment to format
 * @return {string} Date format input 2024-07-15T11:03:49Z -> Output e.g. Jul 15, 2024 - 11:03am
 */
export const formatDateWithTime = ({ date }: { date: moment }): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format('MMM D, YYYY - h:mma');
};

/**
 * Converts a timestamp into a human-readable format to
 * display time units such as "a few seconds ago", "minutes ago",
 * "hours ago", "day ago", or "weeks ago" for past timestamps
 * and similarly "in a second", "in a minute", "in an hour"
 * and so on for future timestamps.
 *
 * @param {moment} timestamp
 * @returns string
 */
export const humanizeTimestamp = (
  locale: string,
  timestamp: moment
): string => {
  return moment(timestamp).locale(locale).fromNow();
};

/**
 * Moment to a locale appropriate string format
 * Returns the date in the user's timezone with the appropriate AM/PM suffix and timezone separated by a comma
 * @param  {moment} date The moment to format
 * @return {string} Date Output e.g. 'Mar 10, 2025 12:00 AM EST'
 */
export const formatDateToUserTimezone = ({
  date,
  showTimezone,
}: {|
  date: moment,
  showTimezone?: boolean,
|}): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  let format = 'MMM Do, YYYY h:mmA';
  if (showTimezone) format += ' z';

  return date.format(format);
};

/**
 * Moment to ISO 8601 date format (YYYY-MM-DD).
 * Useful for HTML date inputs or when a non-locale-specific,
 * sortable date format is required.
 *
 * @param  {moment} date The moment to format
 * @return {string} Date Output e.g. '2025-07-30'
 */
export const formatISODate = (date: moment): string => {
  if (!date || !date.isValid()) {
    return '';
  }
  return date.format('YYYY-MM-DD');
};
