// @flow
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Event } from '@kitman/common/src/types/Event';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

export const getEventsWithRecurringEvents = (
  events: Array<Event>
): Array<Event> => {
  const eventsWithRecurringEvents: Array<Event> = [];
  if (
    !(
      window.featureFlags['repeat-events'] ||
      window.featureFlags['repeat-sessions']
    )
  ) {
    return events;
  }
  events.forEach((event) => {
    if (!getIsRepeatEvent(event)) {
      eventsWithRecurringEvents.push(event);
      return;
    }

    // $FlowIgnore[prop-missing] recurrence will exists due to getIsRepeatEvent check
    const { recurrence, start_date: start, end_date: end } = event;
    if (!recurrence) {
      eventsWithRecurringEvents.push(event);
      return;
    }

    const { rrule_instances: rules } = recurrence;
    if (![end, rules && rules.length > 0, recurrence.rule].every(Boolean)) {
      eventsWithRecurringEvents.push(event);
      return;
    }

    // ‘DTSTART’ property must be appended to event.recurrence.rule so the
    // latter can be interpolated via interpolateRRuleIntoDisplayableText which
    // uses the property for monthly and annually repeated events. The back end
    // doesn’t supply the property due to inconsistencies between Ruby’s and
    // JS’ rrule libraries.
    //
    // The if statement above ensures event.recurrence and
    // event.recurrence.rule exist.
    // $FlowIgnore[incompatible-use]
    // $FlowIgnore[incompatible-type]
    // $FlowIgnore[prop-missing]
    event.recurrence.rule += `;DTSTART=${moment(start).format('YYYYMMDD')}`; // eslint-disable-line no-param-reassign

    // The if statement above ensures `rules` exists.
    // $FlowIgnore[incompatible-use]
    rules.forEach((instanceStartTime, index) => {
      const isParentEvent =
        moment(start).format(DateFormatter.dateTransferFormat) ===
        moment(instanceStartTime).format(DateFormatter.dateTransferFormat);
      // $FlowIgnore[incompatible-call] no incompatible call due to getIsRepeatEvent check
      eventsWithRecurringEvents.push({
        ...event,
        start_date: moment(instanceStartTime).format(
          DateFormatter.dateTransferFormat
        ),
        reactKey: isParentEvent
          ? `${event.id}`
          : `${event.id}${VIRTUAL_EVENT_ID_SEPARATOR}${index - 1}`,
      });
    });
  });
  return eventsWithRecurringEvents.sort(
    (a, b) => moment(b.start_date).valueOf() - moment(a.start_date).valueOf()
  );
};
