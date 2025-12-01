// @flow
// All events-related stuff.
import type { EventImpl } from '@fullcalendar/core';

import type { Event } from '@kitman/common/src/types/Event';
import type { EventType } from '@kitman/modules/src/CalendarPage/src/types';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { type CreatableEventType } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

export const isEventShared = (event: Event | EventImpl): boolean => {
  // flow does not merge unions correctly
  // $FlowIgnore[incompatible-use]
  // $FlowIgnore[prop-missing]
  return !!event?.custom_event_type?.shared;
};

export const getIsRepeatableEvent = (eventType: ?EventType): boolean =>
  eventType === 'custom_event' || eventType === 'session_event';

/*
  checkHasRecurrence will check if the recurrence object exists on the event.
  This will be checked by default, but for scenarios where we don't want to check
  this, e.g. when the event is initially being created, we can pass false to the function.
*/
export const getIsRepeatEvent = (
  event: Event | EventImpl,
  checkHasRecurrence: boolean = true
): boolean => {
  if (!event) return false;

  if (isEventShared(event)) {
    return false;
  }

  const recurrenceCheck =
    // $FlowIgnore[prop-missing]
    checkHasRecurrence ? !!event?.recurrence?.rule : true;

  const isRepeatCustomEventsEnabled =
    recurrenceCheck &&
    event.type.toLowerCase() === 'custom_event' &&
    window.getFlag('custom-events') &&
    window.getFlag('repeat-events');

  const isRepeatSessionsEnabled =
    recurrenceCheck &&
    (event.type.toLowerCase() === 'session_event' ||
      event.type.toLowerCase() === 'training_session') &&
    window.getFlag('repeat-sessions');

  return [isRepeatCustomEventsEnabled, isRepeatSessionsEnabled].some(Boolean);
};

export const HUMAN_READABLE_EVENT_TYPE = Object.freeze({
  Session: 'Session',
  Event: 'Event',
  Game: 'Game',
});
export const getHumanReadableEventType = (
  eventObjectOrType: Event | CreatableEventType
): $Values<typeof HUMAN_READABLE_EVENT_TYPE> => {
  const parsedEventType =
    typeof eventObjectOrType === 'object'
      ? eventObjectOrType.type
      : eventObjectOrType;
  const isSessionEvent = parsedEventType === eventTypePermaIds.session.type;
  const isCustomEvent = parsedEventType === eventTypePermaIds.custom.type;
  let eventType = 'Game';
  if (isSessionEvent) eventType = 'Session';
  if (isCustomEvent) eventType = 'Event';
  return eventType;
};
