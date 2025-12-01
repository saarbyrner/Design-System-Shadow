/* eslint-disable camelcase */
// @flow
import 'core-js/stable/structured-clone';
import { RRule } from 'rrule';
import { EventInput, EventImpl } from '@fullcalendar/core';
import moment from 'moment-timezone';
import _cloneDeep from 'lodash/cloneDeep';

import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import {
  type Event as PlanningEvent,
  type TSOEvent,
  type CustomEvent,
} from '@kitman/common/src/types/Event';
import {
  type CalendarEventBeforeFullCalendar,
  type CalendarEventFromBE,
} from '@kitman/components/src/Calendar/utils/types';
import { type EventFormData } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';

import type { CalendarBaseEvent } from '../components/CalendarEventsPanel/types';
import type { SelectionInfo, FullCalendarApi } from '../types';

export const defaultBackgroundColor = colors.neutral_500_transparent_30;
export const defaultBorderColor = colors.grey_100_50;
export const defaultTextColor = colors.grey_100;
export const emptyRecurrence = {
  rrule_instances: null,
  rule: null,
  original_start_time: null,
  recurring_event_id: null,
  preferences: null,
};

/**
 * @param  {string} inputDateTime
 * @param  {boolean=true} roundMinutesToNearest5
 * @returns string
 */
export const getDateWithCurrentTime = (
  inputDateTime: string,
  roundMinutesToNearest5: boolean = true
): string => {
  const date = moment(inputDateTime);
  const now = moment();
  let minutes = now.get('minute');
  if (roundMinutesToNearest5) {
    minutes = Math.floor(minutes / 5.0) * 5;
  }
  date.set({
    hour: now.get('hour'),
    minute: minutes,
    second: 0,
    millisecond: 0,
  });
  return date.format(dateTransferFormat);
};

const getStartingDateTime = (
  event: typeof EventInput | SelectionInfo,
  useDefaultStartTime: boolean
): moment => {
  const date = moment(event.start);
  if (useDefaultStartTime && event.extendedProps?.defaultStartTime) {
    const [hour, minute, second] =
      event.extendedProps.defaultStartTime.split(':');
    date.set({ hour, minute, second });
  }
  return date;
};

const getEndingDateTime = (
  event: typeof EventInput | SelectionInfo,
  start: moment,
  useStartPlusDuration: boolean
): moment => {
  if (useStartPlusDuration && event.extendedProps?.defaultDurationMins) {
    return moment(start).add(
      event.extendedProps?.defaultDurationMins,
      'minutes'
    );
  }

  return moment(event.end);
};

/**
 * Convert a Planning to a CalendarEventBeforeFullCalendar we can use in redux store
 * @param  {PlanningEvent | CalendarBaseEvent | CustomEvent} event
 * @returns CalendarEventBeforeFullCalendar
 */
export const convertPlanningEventToCalendarEvent = (
  event: PlanningEvent | CalendarBaseEvent | CustomEvent
): CalendarEventBeforeFullCalendar => {
  let id;

  if (event.id != null) {
    id = typeof event.id === 'number' ? event.id.toString() : event.id;
  }

  const converted = {
    backgroundColor: event.background_color || defaultBackgroundColor,
    // $FlowIgnore(incompatible-cast) if border_color exists, it is always a string
    borderColor: (event.border_color ||
      event.background_color ||
      defaultBorderColor: string), // TODO: we need a border and text colours from backend
    textColor:
      typeof event.text_color === 'string'
        ? event.text_color
        : defaultTextColor,
    id,
    start: moment(event.start_date).toISOString() || '',
    end: moment(event.start_date)
      .add(event.duration ? event.duration : 0, 'minutes')
      .toISOString(),
    title: typeof event.name === 'string' ? event.name : '',
    url: id != null ? `/planning_hub/events/${id}` : '',
    type: 'UNKNOWN',
    incompleteEvent: event.id == null,
    editable: event.id == null,
    description: event.description ?? null,
    recurrence: { ...emptyRecurrence },
  };

  if (event.type === 'game_event') {
    converted.type = 'GAME';
    converted.title =
      event.name ||
      event.opponent_squad?.name ||
      event.opponent_team?.name ||
      i18n.t('New event');
  } else if (event.type === 'session_event') {
    converted.type = 'TRAINING_SESSION';
    converted.title =
      event.name || event.session_type?.name || i18n.t('New event');
  } else if (event.type === 'custom_event') {
    converted.type = 'CUSTOM_EVENT';
    converted.title =
      event.name || event.custom_event_type?.name || i18n.t('New event');
  }
  return converted;
};

/**
 * Convert events from the Planning Hub to the Event data type used on the Calendar
 * @param  {Array<PlanningEvent>} events
 * @returns Array<CalendarEventBeforeFullCalendar>
 */
export const convertPlanningEventsToCalendarEvents = (
  events: Array<PlanningEvent>
): Array<CalendarEventBeforeFullCalendar> => {
  return events.map((event: PlanningEvent) =>
    convertPlanningEventToCalendarEvent(event)
  );
};

/**
 * Convert events from the TSO to the Event data type used on the Calendar
 * @param  {Array<TSOEvent>} events
 * @returns Array<CalendarEventBeforeFullCalendar>
 */
export const convertTSOEventsToCalendarEvents = (
  tsoEvents: Array<TSOEvent>
): Array<CalendarEventBeforeFullCalendar> => {
  return tsoEvents.map((event) => {
    const duration = moment
      .duration(moment(event.EndDate).diff(moment(event.StartDate)))
      .asDays();
    return {
      // FullCalendar turns the IDs to strings anyway
      id: event.Id.toString(),
      start: event.StartDate,
      end: event.EndDate,
      title: event.Name,
      description: event.Description,
      url: '/events_management',
      type: 'EVENT',
      backgroundColor: colors.teal_300,
      borderColor: colors.teal_300,
      allDay: duration >= 1,
      recurrence: { ...emptyRecurrence },
      squad: {
        id: event.KitmanTeamId,
        name: '', // not supported
      },
    };
  });
};

/**
 * By clicking on empty space on the calendar you generate selectionInfo which is not a event
 * Convert the SelectionInfo to a PlanningEvent that can be rendered on the Calendar
 * @param  {EventInput|SelectionInfo} event
 * @param  {string} orgTimeZone
 * @returns PlanningEvent
 */
export const convertFullCalEvent = (
  event: typeof EventInput | SelectionInfo,
  eventTimeZone: string
): CalendarBaseEvent => {
  // $FlowFixMe TODO: Will review this all day logic later
  const useDefaultStartTime = event.allDay && !event.extendedProps?.allDay;
  const useStartPlusDuration = !!event.extendedProps?.templateId;

  const start = getStartingDateTime(event, useDefaultStartTime);
  const end = getEndingDateTime(event, start, useStartPlusDuration);
  const durationMinutes = moment.duration(end.diff(start)).asMinutes();
  const startDateTimeStr = start.format(dateTransferFormat);
  const endDateTimeStr = end.format(dateTransferFormat);

  // $FlowFixMe Will only call if setDates present
  event.setDates?.(startDateTimeStr, endDateTimeStr, {
    allDay: false,
  });

  const baseEvent: CalendarBaseEvent = {
    allDay: event.allDay,
    type: 'UNKNOWN',
    // $FlowFixMe if extendedProps not present that is fine
    ...event.extendedProps,
    background_color: event.backgroundColor || defaultBackgroundColor,
    border_color: event.borderColor || defaultBorderColor,
    calendarEventId: event.id,
    duration: durationMinutes,
    start_date: startDateTimeStr,
    text_color: event.textColor || defaultTextColor,
    local_timezone: eventTimeZone,
    name: event.title || i18n.t('New event'),
  };
  return baseEvent;
};

/**
 * Convert event data from Side Panel form to CalendarBaseEvent
 * @param  {EventFormData} eventFormData
 * @returns CalendarBaseEvent
 */
export const eventFormDataToCalendarBaseEvent = (
  eventFormData: EventFormData
): CalendarBaseEvent => {
  const { id, ...converted }: EventFormData = _cloneDeep(eventFormData);
  let idString: string | void;

  if (id) {
    idString = id.toString();
  }
  const name = converted.title;
  delete converted.title;

  // Remove props that don't want to spread into CalendarBaseEvent
  if (converted.type !== 'custom_event') {
    delete converted.surface_type;
    delete converted.surface_quality;
    delete converted.weather;
  }

  // Get event duration as a number as may be a string in EventFormData
  let duration;
  if (converted.duration != null) {
    duration =
      typeof converted.duration === 'number'
        ? converted.duration
        : parseInt(converted.duration, 10);
  }

  if (
    eventFormData.type === 'custom_event' &&
    converted.type === 'custom_event'
  ) {
    // $FlowIgnore - union is ok
    return {
      ...converted,
      name,
      duration,
      ...(idString ? { id: idString } : {}),
    };
  }

  // conversions for game and session event properties
  if (eventFormData.type !== 'custom_event') {
    // Weather conditions are objects in CalendarBaseEvent / PlanningEvents
    const surface_type =
      eventFormData.surface_type != null
        ? {
            id: eventFormData.surface_type,
          }
        : null;

    const surface_quality =
      eventFormData.surface_quality != null
        ? {
            id: eventFormData.surface_quality,
          }
        : null;

    const weather =
      eventFormData.weather != null
        ? {
            id: eventFormData.weather,
          }
        : null;

    if (
      eventFormData.type === 'game_event' &&
      converted.type === 'game_event'
    ) {
      // Remove props that don't want to spread into CalendarBaseEvent
      delete converted.organisation_team_id;
      delete converted.team_id;
      delete converted.venue_type_id;
      delete converted.competition_id;

      // $FlowIgnore - union is ok
      return {
        ...converted,
        ...(idString ? { id: idString } : {}),
        duration,
        surface_type,
        surface_quality,
        weather,
        organisation_team:
          eventFormData.organisation_team_id != null
            ? {
                id: eventFormData.organisation_team_id,
              }
            : null,
        opponent_team:
          eventFormData.team_id != null
            ? {
                ...eventFormData.opponent_team,
                id: eventFormData.team_id,
              }
            : null,
        venue_type:
          eventFormData.venue_type_id != null
            ? {
                id: eventFormData.venue_type_id,
              }
            : null,
        competition:
          eventFormData.competition_id != null
            ? {
                id: eventFormData.competition_id,
              }
            : null,
      };
    }
    let session_type;
    let workload_type = 1;

    if (converted.type === 'session_event') {
      workload_type =
        converted.workload_type != null ? converted.workload_type : 1;
      if (converted.session_type) {
        session_type = {
          ...converted.session_type,
          id: converted.session_type_id,
        };
      } else {
        session_type = null;
      }

      delete converted.session_type_id;
    }

    let season_type;
    if (converted.type !== 'custom_event') {
      season_type = { id: converted.season_type_id };
      delete converted.season_type_id;
      delete converted.team_id;
    }

    // For now we only have game and session events
    return {
      // $FlowIgnore - union is ok
      ...converted,
      ...(idString ? { id: idString } : {}),
      name,
      type: 'session_event',
      duration,
      surface_type,
      surface_quality,
      weather,
      workload_type,
      session_type,
      season_type,
      opponent_team:
        eventFormData.team_id != null
          ? {
              id: eventFormData.team_id,
            }
          : null,
    };
  }
  // $FlowIgnore - union is ok
  return { ...converted, ...(idString ? { id: idString } : {}) };
};

export const getEventTypeText = (calendarEvent: ?typeof EventImpl) => {
  let eventType = 'UNKNOWN';
  if (calendarEvent) {
    eventType =
      calendarEvent.type || calendarEvent.extendedProps?.type || 'UNKNOWN';
  }
  switch (eventType) {
    // sessions created in IP
    case 'TRAINING_SESSION':
      return i18n.t('Training Session');
    // games created in IP
    case 'GAME': {
      return i18n.t('Game');
    }
    // events created in TSO
    case 'EVENT': {
      return i18n.t('Event');
    }
    // custom events created in IP
    case 'CUSTOM_EVENT': {
      return i18n.t('Event');
    }
    default:
      return undefined;
  }
};

// transformBeRecurrenceToFe and transformFeRecurrenceRuleToFitBe bridge the
// gap between JS’ and Ruby’s RRule clients.
export const transformBeRecurrenceToFitFe = ({
  rule,
  startTime,
}: {
  rule: string,
  // Date needs to be in UTC for RRule to function properly
  // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
  startTime: string,
}): string =>
  `DTSTART:${startTime
    .split('.')[0]
    // replaceAll is supported by all browsers, guess it's missing in the
    // old version of Flow.
    // $FlowIgnore[prop-missing]
    .replaceAll('-', '')
    .replaceAll(':', '')}${startTime.includes('Z') ? '' : 'Z'}\nRRULE:${rule}`;

// Removes the DTSTART property which Ruby RRule client can’t handle.
export const transformFeRecurrenceRuleToFitBe = (rrule: typeof RRule): string =>
  rrule?.toString?.().split('RRULE:')[1];

// The instances don't exist in the DB yet, need to add them in memory
export const addEventRecurrencesForRepeatingEvents = (
  calendarEvents: Array<{
    ...CalendarEventFromBE,
    end_date?: string,
    local_timezone: string,
  }>
): Array<{
  ...CalendarEventBeforeFullCalendar,
  start_date?: string,
  local_timezone: string,
}> => {
  const eventsToReturn: Array<{
    ...CalendarEventBeforeFullCalendar,
    start_date?: string,
    local_timezone: string,
  }> = [];
  if (!calendarEvents) return [];
  if (
    !(
      window.featureFlags['repeat-events'] ||
      window.featureFlags['repeat-sessions']
    )
  ) {
    return calendarEvents.map<{
      ...CalendarEventBeforeFullCalendar,
      start_date?: string,
      local_timezone: string,
    }>((event) => ({
      ...event,
      // FullCalendar turns the IDs to strings anyway, and the instance IDs must be strings
      // so they can be unique and identifiable
      id: event.id.toString(),
      isVirtualEvent: false,
    }));
  }
  calendarEvents.forEach((event) => {
    const { recurrence, start, end, id } = event;
    const { rrule_instances, rule } = recurrence;
    const startMoment = moment(start);

    const modifiedEvent = {
      ...event,
      // FullCalendar turns the IDs to strings anyway, and the instance IDs must be strings
      // so they can be unique and identifiable
      id: id.toString(),
      recurrence: {
        ...recurrence,
        ...(rule
          ? {
              rule: transformBeRecurrenceToFitFe({
                rule,
                // Date needs to be in UTC for RRule to function properly. The
                // back end provides dates in UTC.
                // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
                startTime: startMoment.toISOString(),
              }),
            }
          : {}),
      },
    };

    // Adding support for calendar events and planning_hub events
    const endDate = end ?? event.end_date;

    if (!endDate || !(rrule_instances && rrule_instances.length > 0)) {
      eventsToReturn.push(modifiedEvent);
      return;
    }
    // This is a repeat event with instances
    const clonedEvent = window.structuredClone(modifiedEvent);
    const endMoment = moment(endDate);
    const diff = endMoment.diff(startMoment);

    rrule_instances.forEach((instanceStartTime, index) => {
      const isParentEvent =
        moment(start).format(dateTransferFormat) ===
        moment(instanceStartTime).format(dateTransferFormat);
      const instanceFakeId = isParentEvent
        ? `${clonedEvent.id}`
        : `${clonedEvent.id}${VIRTUAL_EVENT_ID_SEPARATOR}${index - 1}`;

      eventsToReturn.push({
        ...clonedEvent,
        id: instanceFakeId,
        start: moment(instanceStartTime).format(dateTransferFormat),
        end: moment(instanceStartTime).add(diff).format(dateTransferFormat),
        eventCollectionComplete: isParentEvent
          ? clonedEvent.eventCollectionComplete
          : false,
        isVirtualEvent: !isParentEvent,
      });
    });
  });
  return eventsToReturn;
};

export const getIsEditedRecurrenceRuleLessFrequent = (
  editedRRule: RRule,
  rrule: RRule
  // Freq is an integer, which will identify how often the rule repeats.
  // The greater the number, the more frequent (and vice-versa)
): boolean => {
  // If no edited rule, rule is does not repeat
  if (!editedRRule) {
    return true;
  }
  return editedRRule.options?.freq < rrule.options?.freq;
};

export const resetFullCalendarEventState = ({
  fullCalendarEventsFromRedux,
  fullCalendarEventId,
  fullCalendarApi,
}: {
  fullCalendarEventsFromRedux: Array<typeof EventImpl>,
  fullCalendarEventId: string,
  fullCalendarApi: ?FullCalendarApi,
}) => {
  const initialFullCalendarEvent = fullCalendarEventsFromRedux.find(
    (fullCalendarEvent) => fullCalendarEvent?.id === fullCalendarEventId
  );
  if (initialFullCalendarEvent) {
    fullCalendarApi?.getEventById(fullCalendarEventId)?.remove();
    fullCalendarApi?.addEvent(initialFullCalendarEvent);
  }
};

export const getNotificationsConfirmationModalTranslatedText = () => ({
  title: i18n.t('Confirm you would like to notify selected recipients?'),
  actions: {
    cancelButton: i18n.t(`Don't send`),
    ctaButton: i18n.t('Send'),
  },
});

type NotificationChannels = {
  +athlete?: Array<string>,
  +staff?: Array<string>,
};

type NotificationTrigger = {
  area: string,
  enabled_channels: ?NotificationChannels,
};

export const isNotificationActionable = (
  notificationTriggers: ?Array<NotificationTrigger>,
  eventNotificationChannels: ?NotificationChannels
) => {
  // Find the  organization's default notification settings for event
  const defaultEventTrigger = notificationTriggers?.find(
    (trigger) => trigger.area === 'event'
  );

  // Then, establish the `effectiveChannels` by prioritizing the user's override
  // (`event.notification_channels`) over the organization's defaults.
  const effectiveChannels =
    eventNotificationChannels || defaultEventTrigger?.enabled_channels;

  // Finally, return true if there is at least one enabled channel for either athletes or staff.
  return (
    !!effectiveChannels?.athlete?.length || !!effectiveChannels?.staff?.length
  );
};
