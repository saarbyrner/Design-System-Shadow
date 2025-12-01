// @flow
import moment from 'moment';
import type { EventImpl } from '@fullcalendar/core';

import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { calendarEventTypeEnumLike } from '@kitman/components/src/Calendar/utils/enum-likes';
import { creatableEventTypeEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/enumLikes';

export const createPlanningEventUrl = ({
  id,
  start,
  url: eventUrl,
  hash,
  extendedProps,
  openEventSwitcherSidePanel,
}: EventImpl): string => {
  const params = new URLSearchParams();
  const isRepeatingEventsEnabled =
    (window.getFlag('repeat-events') &&
      (extendedProps?.type === calendarEventTypeEnumLike.CustomEvent ||
        extendedProps?.type === creatableEventTypeEnumLike.CustomEvent)) ||
    (window.getFlag('repeat-sessions') &&
      (extendedProps?.type === calendarEventTypeEnumLike.TrainingSession ||
        extendedProps?.type === creatableEventTypeEnumLike.Session));
  const isVirtualEvent =
    isRepeatingEventsEnabled &&
    id.toString().includes(VIRTUAL_EVENT_ID_SEPARATOR);
  const isVirtualSessionEvent =
    isVirtualEvent &&
    (extendedProps?.type === calendarEventTypeEnumLike.TrainingSession ||
      extendedProps?.type === creatableEventTypeEnumLike.Session);

  if (isRepeatingEventsEnabled) {
    params.set('include_rrule_instance', 'true');
  }

  if (isVirtualEvent) {
    params.set(
      'original_start_time',
      // start is already the virtual event's start time, injected beforehand
      moment(start)
        // Date needs to be in UTC for RRule to function properly
        // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
        .utc()
        .toISOString()
    );
  }

  if (openEventSwitcherSidePanel) {
    params.set('open_event_switcher_panel', 'true');
  }

  const paramsString = params.toString();
  const url = isVirtualSessionEvent ? `${eventUrl}/transform_event` : eventUrl;
  return `${url}${paramsString ? `?${paramsString}` : ''}${
    hash ? `#${hash}` : ''
  }`;
};
