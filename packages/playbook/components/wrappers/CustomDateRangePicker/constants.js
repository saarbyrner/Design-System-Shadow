// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { CustomFilter } from './types';
import { getThisMonth, getThisWeek, getThisYear } from './utils';

// Default quick filters available in the dropdown

export const getDefaultFilters = (): Array<CustomFilter> => {
  return [
    {
      key: 'week',
      label: i18n.t('This Week'),
      getDateRange: getThisWeek,
    },
    {
      key: 'month',
      label: i18n.t('This Month'),
      getDateRange: getThisMonth,
    },
    {
      key: 'year',
      label: i18n.t('This Year'),
      getDateRange: getThisYear,
    },
  ];
};
