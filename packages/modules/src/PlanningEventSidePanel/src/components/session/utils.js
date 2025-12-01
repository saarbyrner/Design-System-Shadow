// @flow
import { type SessionThemeOptionTypes } from '@kitman//common/src/types/Event';
import type { Option } from '@kitman/components/src/Select';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';

import { sessionTypeAndOptionSeparator } from './constants';

export const stringifySessionTypeAndOption = (
  type: ?SessionThemeOptionTypes,
  option: ?(string | number)
) => `${type ?? ''}${sessionTypeAndOptionSeparator}${option ?? ''}`;

export const getSessionThemeSubOptions = (
  options: Array<any>,
  type: SessionThemeOptionTypes
): Array<Option> => {
  return defaultMapToOptions(options).map((o) => ({
    ...o,
    value: stringifySessionTypeAndOption(type, o.value),
  }));
};
