// @flow
import moment from 'moment';

/**
 * Calculate the current age based on the given birth date.
 * Supports multiple date formats: 'YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD MMMM YYYY'.
 *
 * @param {string} birthDate - The birth date in string format.
 * @returns {string} - The calculated age as a string.
 * @throws {Error} - Throws an error if the date format is unsupported.
 */
const getCurrentAge = (birthDate: ?string): string => {
  if (!birthDate) {
    return '-';
  }
  const today = moment();
  let birthMoment;

  const dateFormats = [
    { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'YYYY-MM-DD' },
    { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'MM/DD/YYYY' },
    { regex: /^\d{2}-\d{2}-\d{4}$/, format: 'DD-MM-YYYY' },
    { regex: /^\d{2} \w+ \d{4}$/, format: 'DD MMMM YYYY' },
  ];

  const matchedFormat = dateFormats.find(({ regex }) => regex.test(birthDate));

  if (matchedFormat) {
    birthMoment = moment(birthDate, matchedFormat.format);
  } else {
    throw new Error('Unsupported date format');
  }

  let age = today.diff(birthMoment, 'years');

  // Check if today is the birthday
  if (today.isSame(birthMoment, 'month') && today.isSame(birthMoment, 'date')) {
    age += 1;
  }

  return age.toString();
};

export default getCurrentAge;
