// @flow
import _get from 'lodash/get';

/**
 * @type {'asc'|'desc'} Direction
 */
export type Direction = 'asc' | 'desc';

/**
 * @typedef Options
 * @type {object}
 * @property {boolean} emptyAtEnd - whether to put empty values at the end of the sort regardles of direction.
 * @property {boolean} numeric - the direction numeric values will be sorted
 */
type Options = {
  emptyAtEnd?: boolean,
  numeric?: boolean,
};

const getLocaleCompareOptions = (locale: string, numeric: boolean = true) => {
  return [locale, { numeric }];
};

const defaultOptions: Options = {
  emptyAtEnd: false,
  numeric: true,
};

/**
 * Sorts an array of strings based on locale given
 *
 * @param {Array<string>} arr the array to be sorted based on locale given
 * @param {Direction} dir Direction of the array
 * @param {Options} options Options
 * @returns {Array<string>}
 */
export const localeSort = (
  arr: Array<string>,
  locale: string,
  dir: Direction = 'asc',
  options: Options = {}
): Array<string> => {
  const { emptyAtEnd, numeric } = {
    ...defaultOptions,
    ...options,
  };

  return [...arr].sort((a: string, b: string) => {
    if (emptyAtEnd) {
      if (a === '' || a === null) return 1;
      if (b === '' || b === null) return -1;
    }

    if (dir === 'asc') {
      return a.localeCompare(b, ...getLocaleCompareOptions(locale, numeric));
    }

    return b.localeCompare(a, ...getLocaleCompareOptions(locale, numeric));
  });
};

/**
 * Sorts an array of objects based on locale given
 *
 * @param {Array<Object>} arr array of objects to be sorted based on locale given
 * @param {string} field property to sort the array by
 * @param {Direction} dir Direction to sort the array by
 * @param {Options} options Options
 * @returns {Array<Object>}
 */
export const localeSortByField = (
  arr: Array<Object>,
  field: string,
  locale: string,
  dir: Direction = 'asc',
  options: Options = {}
): Array<Object> => {
  const { emptyAtEnd, numeric } = {
    ...defaultOptions,
    ...options,
  };

  return [...arr].sort((a: Object, b: Object) => {
    const aString = _get(a, field, '');
    const bString = _get(b, field, '');

    if (emptyAtEnd) {
      if (aString === '' || aString === null) return 1;
      if (bString === '' || bString === null) return -1;
    }

    if (dir === 'asc') {
      return aString.localeCompare(
        bString,
        ...getLocaleCompareOptions(locale, numeric)
      );
    }

    return bString.localeCompare(
      aString,
      ...getLocaleCompareOptions(locale, numeric)
    );
  });
};
