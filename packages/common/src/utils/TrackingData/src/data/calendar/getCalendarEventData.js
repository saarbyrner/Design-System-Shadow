// @flow
import moment from 'moment-timezone';

import {
  type Event,
  type CustomEventsUser,
} from '@kitman/common/src/types/Event';
import {
  type EditEventPanelMode,
  type EventFormData,
  type RecurrenceChangeScope,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import {
  type DataToDetermineEvent,
  type CalendarFilterTrackingData,
  type AddSessionEventTrackingData,
  type EditSessionEventTrackingData,
  type AddGameEventTrackingData,
  type EditGameEventTrackingData,
  type AddCustomEventTrackingData,
  type EditCustomEventTrackingData,
  type DuplicateSessionEventTrackingData,
  type DeleteEventTrackingData,
  type CommonAthleteStaffSelectionCount,
} from '@kitman/common/src/utils/TrackingData/src/types/calendar';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

import { parseRepeatEventFrequency } from './utils';

const commonAthleteStaffSelectionData = (
  athletes: ?Array<number | string>,
  staff: ?Array<number> | Array<CustomEventsUser>
): CommonAthleteStaffSelectionCount => ({
  'Athletes Count': Array.isArray(athletes) ? athletes.length : 0,
  'Staff Count': Array.isArray(staff) ? staff.length : 0,
});

const getAddCustomEventData = (
  eventData: EventFormData | Event,
  isRepeatEvent: boolean
): AddCustomEventTrackingData => ({
  'Entry point':
    window.location.pathname === '/calendar' ? 'Calendar' : 'Schedule',
  Attachment: eventData.attachments ? eventData.attachments.length > 0 : false,
  Link: eventData.attached_links ? eventData.attached_links.length > 0 : false,
  Staff:
    eventData?.staff_id && Array.isArray(eventData.staff_id)
      ? eventData.staff_id?.length > 0
      : false,
  Location: !!eventData.event_location,
  Athletes:
    eventData.athlete_ids && Array.isArray(eventData.athlete_ids)
      ? eventData.athlete_ids?.length > 0
      : false,
  'Repeat event': isRepeatEvent,
  'Repeat event occurrence': isRepeatEvent
    ? // rule will exist if isRepeatEvent is true.
      parseRepeatEventFrequency(
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        // $FlowIgnore[incompatible-use]
        eventData.recurrence.rule,
        moment.tz(
          // $FlowIgnore[prop-missing]
          eventData.start_time ?? eventData.start_date,
          eventData.local_timezone
        )
      )
    : "Doesn't repeat",
  ...commonAthleteStaffSelectionData(
    eventData.athlete_ids,
    // $FlowIgnore event_users is a common attribute
    eventData.event_users
  ),
});

const getEditCustomEventData = (
  eventData: EventFormData | Event,
  isRepeatEvent: boolean
): EditCustomEventTrackingData => ({
  Attachment: eventData.attachments ? eventData.attachments.length > 0 : false,
  Link: eventData.attached_links ? eventData.attached_links.length > 0 : false,
  Location: !!eventData.event_location,
  Staff:
    eventData?.staff_id && Array.isArray(eventData.staff_id)
      ? eventData.staff_id?.length > 0
      : false,
  Athletes:
    eventData.athlete_ids && Array.isArray(eventData.athlete_ids)
      ? eventData.athlete_ids?.length > 0
      : false,
  'Repeat event': isRepeatEvent,
  'Repeat event occurrence': isRepeatEvent
    ? // rule will exist if isRepeatEvent is true.
      parseRepeatEventFrequency(
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        // $FlowIgnore[incompatible-use]
        eventData.recurrence.rule,
        moment.tz(
          // $FlowIgnore[prop-missing]
          eventData.start_time ?? eventData.start_date,
          eventData.local_timezone
        )
      )
    : "Doesn't repeat",
  ...commonAthleteStaffSelectionData(
    eventData.athlete_ids,
    // $FlowIgnore event_users is a common attribute
    eventData.event_users
  ),
});

const getAddSessionEventData = (
  eventData: EventFormData | Event,
  isRepeatEvent: boolean,
  createWithNoParticipants: boolean
): AddSessionEventTrackingData => ({
  // $FlowIgnore workload_type is number
  'Workload type': eventData.workload_type || null,
  'Entry point':
    window.location.pathname === '/calendar' ? 'Calendar' : 'Schedule',
  Attachment: eventData.attachments ? eventData.attachments.length > 0 : false,
  Link: eventData.attached_links ? eventData.attached_links.length > 0 : false,
  Staff:
    eventData?.staff_id && Array.isArray(eventData.staff_id)
      ? eventData.staff_id?.length > 0
      : false,
  Location: !!eventData.event_location,
  // $FlowIgnore start_date will be populated or undefined
  'Date of session': eventData.start_date ?? null,
  'Repeat event': isRepeatEvent,
  'Repeat event occurrence': isRepeatEvent
    ? // rule will exist if isRepeatEvent is true.
      parseRepeatEventFrequency(
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        // $FlowIgnore[incompatible-use]
        eventData.recurrence.rule,
        moment.tz(
          // $FlowIgnore[prop-missing]
          eventData.start_time ?? eventData.start_date,
          eventData.local_timezone
        )
      )
    : "Doesn't repeat",
  // $FlowIgnore rule will exist if isRepeatEvent is true
  'Recurrence preferences': eventData.recurrence?.preferences ?? null,
  'Create with no participants': createWithNoParticipants,
  ...commonAthleteStaffSelectionData(
    eventData.athlete_ids,
    // $FlowIgnore event_users is a common attribute
    eventData.event_users
  ),
});

const getEditSessionEventData = (
  eventData: EventFormData | Event,
  isRepeatEvent: boolean
): EditSessionEventTrackingData => ({
  Attachment: eventData.attachments ? eventData.attachments.length > 0 : false,
  Link: eventData.attached_links ? eventData.attached_links.length > 0 : false,
  // $FlowIgnore workload_type is number
  'Workload type': eventData.workload_type || null,
  Location: !!eventData.event_location,
  'Repeat event': isRepeatEvent,
  'Repeat event occurrence': isRepeatEvent
    ? // rule will exist if isRepeatEvent is true.
      parseRepeatEventFrequency(
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        // $FlowIgnore[incompatible-use]
        eventData.recurrence.rule,
        moment.tz(
          // $FlowIgnore[prop-missing]
          eventData.start_time ?? eventData.start_date,
          eventData.local_timezone
        )
      )
    : "Doesn't repeat",
  // $FlowIgnore rule will exist if isRepeatEvent is true
  'Recurrence preferences': eventData.recurrence?.preferences ?? null,
  ...commonAthleteStaffSelectionData(
    eventData.athlete_ids,
    // $FlowIgnore event_users is a common attribute
    eventData.event_users
  ),
});

const getDuplicateSessionEventData = (
  eventData: EventFormData | Event,
  additionalMixpanelSessionData,
  isRepeatEvent: boolean
): DuplicateSessionEventTrackingData => {
  const { areParticipantsDuplicated, isSessionPlanDuplicated, drillsCount } =
    additionalMixpanelSessionData;

  return {
    'Entry point':
      window.location.pathname === '/calendar' ? 'Calendar' : 'Session view',
    'Duplicate participants': areParticipantsDuplicated ?? false,
    'Duplicate session plan': isSessionPlanDuplicated ?? false,
    '# of drills duplicated': isSessionPlanDuplicated ? drillsCount : 0,
    'Repeat event': isRepeatEvent,
    'Repeat event occurrence': isRepeatEvent
      ? // rule will exist if isRepeatEvent is true.
        parseRepeatEventFrequency(
          // $FlowIgnore[prop-missing]
          // $FlowIgnore[incompatible-call]
          // $FlowIgnore[incompatible-use]
          eventData.recurrence.rule,
          moment.tz(
            // $FlowIgnore[prop-missing]
            eventData.start_time ?? eventData.start_date,
            eventData.local_timezone
          )
        )
      : "Doesn't repeat",
    // $FlowIgnore rule will exist if isRepeatEvent is true
    'Recurrence preferences': eventData.recurrence?.preferences ?? null,
    ...commonAthleteStaffSelectionData(
      eventData.athlete_ids,
      // $FlowIgnore event_users is a common attribute
      eventData.event_users
    ),
  };
};

const getAddGameEventData = (
  eventData: EventFormData | Event,
  panelMode: EditEventPanelMode
): AddGameEventTrackingData => {
  const hasStaff =
    eventData?.staff_id && Array.isArray(eventData.staff_id)
      ? eventData.staff_id?.length > 0
      : false;
  const usedCustomPosition =
    eventData.opponent_team && eventData.opponent_team.custom
      ? eventData.opponent_team.custom
      : false;

  return {
    Duplicated: panelMode === 'DUPLICATE',
    'Entry point':
      window.location.pathname === '/calendar' ? 'Calendar' : 'Schedule',
    Attachment: eventData.attachments
      ? eventData.attachments.length > 0
      : false,
    Link: eventData.attached_links
      ? eventData.attached_links.length > 0
      : false,
    Staff: hasStaff,
    Location: !!eventData.event_location,
    // $FlowIgnore start_date will be populated or undefined
    'Date of event': eventData.start_date ?? null,
    // $FlowIgnore custom_period_duration_enabled will be true or undefined
    'Custom duration used': eventData.custom_period_duration_enabled ?? false,
    'Chosen format': eventData.organisation_format
      ? !!eventData.organisation_format
      : false,
    // $FlowIgnore custom is boolean if exists
    'Used custom opposition': usedCustomPosition,
    ...commonAthleteStaffSelectionData(
      eventData.athlete_ids,
      // $FlowIgnore event_users is a common attribute
      eventData.event_users
    ),
  };
};

const getEditGameEventData = (
  eventData: EventFormData | Event
): EditGameEventTrackingData => ({
  Attachment: eventData.attachments ? eventData.attachments.length > 0 : false,
  Link: eventData.attached_links ? eventData.attached_links.length > 0 : false,
  Location: !!eventData.event_location,
  Staff:
    eventData?.staff_id && Array.isArray(eventData.staff_id)
      ? eventData.staff_id?.length > 0
      : false,
  ...commonAthleteStaffSelectionData(
    eventData.athlete_ids,
    // $FlowIgnore event_users is a common attribute
    eventData.event_users
  ),
});

const getDeleteEventData = (
  eventData: EventFormData | Event,
  eventScope: RecurrenceChangeScope
): DeleteEventTrackingData => {
  // $FlowIgnore util will handle undefined
  const isRepeatEvent = getIsRepeatEvent(eventData);

  return {
    'Repeat event': isRepeatEvent,
    'Repeat event scope': isRepeatEvent ? eventScope : null,
  };
};

const getCalendarFilterData = (
  selectedFilters: Array<string>
): CalendarFilterTrackingData => ({
  'Filtered by': selectedFilters,
});

const getCalendarEventData = ({
  eventType,
  panelMode,
  eventToTrack,
  additionalMixpanelSessionData,
  isRepeatEvent,
  createWithNoParticipants,
}: DataToDetermineEvent) => {
  const type = eventType;
  const isEditFlow = panelMode === 'EDIT';
  const isAddFlow = panelMode === 'CREATE';

  if (type === 'game_event') {
    if (isEditFlow) {
      return getEditGameEventData(eventToTrack);
    }
    return getAddGameEventData(eventToTrack, panelMode);
  }

  if (type === 'session_event') {
    if (isEditFlow) {
      return getEditSessionEventData(eventToTrack, isRepeatEvent);
    }
    if (isAddFlow) {
      return getAddSessionEventData(
        eventToTrack,
        isRepeatEvent,
        createWithNoParticipants
      );
    }
    return getDuplicateSessionEventData(
      eventToTrack,
      additionalMixpanelSessionData,
      isRepeatEvent
    );
  }

  // Custom Event Flow (default)
  if (isEditFlow) {
    return getEditCustomEventData(eventToTrack, isRepeatEvent);
  }
  return getAddCustomEventData(eventToTrack, isRepeatEvent);
};

export { getCalendarEventData, getCalendarFilterData, getDeleteEventData };
