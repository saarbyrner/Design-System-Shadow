// @flow
import moment from 'moment-timezone';

import { isRRuleCustom } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/config-helpers';
import { type RepeatEventOccurrence } from '@kitman/common/src/utils/TrackingData/src/types/calendar';
import i18n from '@kitman/common/src/utils/i18n';


export const parseRepeatEventFrequency = (
  rule: string,
  eventDate: typeof moment
): RepeatEventOccurrence => {
  if (!rule) {
    return `Doesn't repeat`;
  }

  if (isRRuleCustom(rule, i18n.t, eventDate)) {
    return 'Custom';
  }

  const freqString = rule?.split(';')[0]?.split('=')[1];

  switch (freqString) {
    case 'DAILY':
      return 'Daily';
    case 'WEEKLY':
      return 'Weekly';
    case 'MONTHLY':
      return 'Monthly';
    case 'YEARLY':
      return 'Yearly';
    default:
      return `Doesn't repeat`;
  }
};
