// @flow
import type {
  EditEventPanelMode,
  EventFormData,
  CreatableEventType,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { Event } from '@kitman/common/src/types/Event';
import { type RecurrencePreferencesOptions } from '@kitman/services/src/services/planning/getRecurrencePreferences';

export type RepeatEventOccurrence =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Yearly'
  | 'Custom'
  | "Doesn't repeat";

type RepeatEventCommonAttributes = $Exact<{
  'Repeat event': boolean,
  'Repeat event occurrence': RepeatEventOccurrence,
}>;

export type CommonAthleteStaffSelectionCount = $Exact<{
  'Athletes Count': number,
  'Staff Count': number,
}>;

export type AdditionalMixpanelSessionData = $Exact<{
  areParticipantsDuplicated: boolean,
  isSessionPlanDuplicated: boolean,
  drillsCount: number,
}>;

export type DataToDetermineEvent = $Exact<{
  eventType: CreatableEventType,
  panelMode: EditEventPanelMode,
  eventToTrack: EventFormData | Event,
  additionalMixpanelSessionData: AdditionalMixpanelSessionData,
  isRepeatEvent: boolean,
  createWithNoParticipants: boolean,
}>;

/*
  Session types
*/
export type AddSessionEventTrackingData = $Exact<{
  'Entry point': 'Calendar' | 'Schedule',
  Attachment: boolean,
  Link: boolean,
  Staff: boolean,
  'Workload type': ?number,
  Location: boolean,
  'Date of session': ?string,
  'Recurrence preferences': ?Array<RecurrencePreferencesOptions>,
  'Create with no participants': boolean,
  ...RepeatEventCommonAttributes,
  ...CommonAthleteStaffSelectionCount,
}>;
export type EditSessionEventTrackingData = $Exact<{
  Attachment: boolean,
  Link: boolean,
  'Workload type': ?number,
  Location: boolean,
  'Recurrence preferences': ?Array<RecurrencePreferencesOptions>,
  ...RepeatEventCommonAttributes,
  ...CommonAthleteStaffSelectionCount,
}>;
export type DuplicateSessionEventTrackingData = $Exact<{
  'Entry point': 'Calendar' | 'Session view',
  'Duplicate participants': boolean,
  'Duplicate session plan': boolean,
  '# of drills duplicated': number,
  'Recurrence preferences': ?Array<RecurrencePreferencesOptions>,
  ...RepeatEventCommonAttributes,
  ...CommonAthleteStaffSelectionCount,
}>;

/*
  Game types
*/
export type AddGameEventTrackingData = $Exact<{
  Duplicated: boolean,
  'Entry point': 'Calendar' | 'Schedule',
  Attachment: boolean,
  Link: boolean,
  Staff: boolean,
  Location: boolean,
  'Date of event': string,
  'Custom duration used': boolean,
  'Chosen format': boolean,
  'Used custom opposition': boolean,
  ...CommonAthleteStaffSelectionCount,
}>;
export type EditGameEventTrackingData = $Exact<{
  Attachment: boolean,
  Link: boolean,
  Staff: boolean,
  Location: boolean,
  ...CommonAthleteStaffSelectionCount,
}>;

/*
  Custom event types
*/
export type AddCustomEventTrackingData = $Exact<{
  'Entry point': 'Calendar' | 'Schedule',
  Attachment: boolean,
  Link: boolean,
  Location: boolean,
  Staff: boolean,
  Athletes: boolean,
  ...RepeatEventCommonAttributes,
  ...CommonAthleteStaffSelectionCount,
}>;
export type EditCustomEventTrackingData = $Exact<{
  Attachment: boolean,
  Link: boolean,
  Location: boolean,
  Staff: boolean,
  Athletes: boolean,
  ...RepeatEventCommonAttributes,
  ...CommonAthleteStaffSelectionCount,
}>;

export type EventTrackingData = $Exact<{
  Duplicated: boolean,
  'Entry point': 'Calendar' | 'Schedule',
  Attachment: ?boolean,
  Link: ?boolean,
  Staff: boolean,
  Location: boolean,
  'Workload type': ?number,
  Athletes: boolean,
}>;

export type DeleteEventTrackingData = $Exact<{
  'Repeat event': boolean,
  'Repeat event scope': 'this' | 'next' | null,
}>;

export type CalendarFilterTrackingData = $Exact<{
  'Filtered by': Array<string>,
}>;
