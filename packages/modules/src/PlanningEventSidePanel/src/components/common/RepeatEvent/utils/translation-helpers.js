// @flow
import type { Translation } from '@kitman/common/src/types/i18n';
import type { WeekNum } from './types';

export const getDaysOfWeekTranslated = (t: Translation) => ({
  monday: t('Monday'),
  tuesday: t('Tuesday'),
  wednesday: t('Wednesday'),
  thursday: t('Thursday'),
  friday: t('Friday'),
  saturday: t('Saturday'),
  sunday: t('Sunday'),
});

type GetWeekDayOrdinal = {
  isLastWeekOfMonth: boolean,
  weekNum: WeekNum,
  t: Translation,
};

export const getWeekDayOrdinal = ({
  weekNum,
  isLastWeekOfMonth,
  t,
}: GetWeekDayOrdinal) => {
  if (isLastWeekOfMonth) return t('last'); // separate because 4 could be the last
  switch (weekNum) {
    case 1:
      return t('first');
    case 2:
      return t('second');
    case 3:
      return t('third');
    case 4:
      return t('fourth');
    default:
      return '';
  }
};
