// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { Timescope } from '@kitman/modules/src/analysis/TemplateDashboards/types';

type Option = {
  value: string,
  label: string,
};

export const getDateRanges = (): Option[] => [
  { value: TIME_PERIODS.today, label: i18n.t('Today') },
  { value: TIME_PERIODS.yesterday, label: i18n.t('Yesterday') },
  { value: TIME_PERIODS.thisWeek, label: i18n.t('This Week') },
  { value: TIME_PERIODS.lastWeek, label: i18n.t('Last Week') },
  { value: TIME_PERIODS.lastMonth, label: i18n.t('Last Month') },
  { value: TIME_PERIODS.thisSeasonSoFar, label: i18n.t('This Season So Far') },
  { value: TIME_PERIODS.thisSeason, label: i18n.t('This Season') },
  { value: TIME_PERIODS.thisPreSeason, label: i18n.t('This Pre Season') },
  { value: TIME_PERIODS.thisInSeason, label: i18n.t('This In Season') },
  { value: TIME_PERIODS.lastXDays, label: i18n.t('Last (x) Days') },
  { value: TIME_PERIODS.customDateRange, label: i18n.t('Custom Date Range') },
  { value: TIME_PERIODS.allTime, label: i18n.t('All Time') },
];

export const getDevelopmentJourneyDateRanges = (): Option[] => [
  { value: TIME_PERIODS.today, label: i18n.t('Today') },
  { value: TIME_PERIODS.yesterday, label: i18n.t('Yesterday') },
  { value: TIME_PERIODS.thisWeek, label: i18n.t('This Week') },
  { value: TIME_PERIODS.lastWeek, label: i18n.t('Last Week') },
  { value: TIME_PERIODS.lastMonth, label: i18n.t('Last Month') },
  { value: TIME_PERIODS.thisSeasonSoFar, label: i18n.t('This Season So Far') },
  { value: TIME_PERIODS.lastXDays, label: i18n.t('Last (x) Days') },
  { value: TIME_PERIODS.customDateRange, label: i18n.t('Custom Date Range') },
  { value: TIME_PERIODS.allTime, label: i18n.t('All Time') },
];

export const isValidTimescope = (timescope: Timescope) => {
  if (!timescope?.time_period) {
    return false;
  }
  if (
    timescope.time_period === TIME_PERIODS.customDateRange &&
    (!timescope.start_time || !timescope.end_time)
  ) {
    return false;
  }

  if (
    timescope.time_period === TIME_PERIODS.lastXDays &&
    timescope.time_period_length == null
  ) {
    return false;
  }

  return true;
};
