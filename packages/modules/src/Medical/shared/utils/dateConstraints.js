/* eslint-disable no-nested-ternary */
// @flow

import moment from 'moment-timezone';
import type { TransferRecord } from '@kitman/services/src/services/getAthleteData';

export type ActivePeriod = {
  start?: string | null,
  end?: string | null,
};

export type Period = {
  start: ?string,
  end: ?string,
};

type Constraints = {
  active_periods?: Array<Period>,
};

export type ShowPlayerMovementDatePicker = () => boolean;

export const isDateAfterAllowedCreationDate = (
  startTime: string,
  transferRecord: TransferRecord,
  constraints: ?Constraints,
  showPlayerMovementDatePicker: ShowPlayerMovementDatePicker
): boolean => {
  if (showPlayerMovementDatePicker()) {
    if (!constraints || !constraints.active_periods) {
      return false;
    }

    const activePeriods = constraints.active_periods;

    const hasUnrestrictedPeriod = activePeriods.some(
      (period) => period.start === null && period.end === null
    );

    if (hasUnrestrictedPeriod) {
      return false;
    }

    const earliestActivePeriodStart =
      activePeriods.length > 0
        ? activePeriods
            .filter((period) => period.start)
            .reduce((earliest, period) => {
              const periodStart = moment(period.start);
              return earliest ? moment.min(earliest, periodStart) : periodStart;
            }, null)
        : null;

    const hasNullStartDate = activePeriods.some(
      (period) => period.start === null
    );
    const hasNullEndDate = activePeriods.some((period) => period.end === null);

    const isWithinActivePeriods = activePeriods.some((period) => {
      const periodStart = period.start ? moment(period.start) : null;
      const periodEnd = period.end ? moment(period.end) : null;
      return periodStart
        ? moment(startTime).isBetween(periodStart, periodEnd, 'day', '[]')
        : periodEnd
        ? moment(startTime).isSameOrBefore(periodEnd, 'day')
        : true;
    });

    if (hasNullStartDate || hasNullEndDate) {
      return !isWithinActivePeriods;
    }

    if (earliestActivePeriodStart) {
      return (
        moment(startTime).isAfter(earliestActivePeriodStart, 'day') &&
        !isWithinActivePeriods
      );
    }
  } else if (transferRecord?.left_at) {
    return !moment(startTime).isSameOrBefore(transferRecord.left_at, 'day');
  }

  return false;
};

export const isDateBeforeAllowedCreationDate = (
  startTime: string,
  transferRecord: TransferRecord
): boolean => {
  if (transferRecord?.joined_at) {
    return !moment(transferRecord.joined_at)
      .add(1, 'days')
      .isSameOrBefore(startTime, 'day');
  }
  return false;
};
