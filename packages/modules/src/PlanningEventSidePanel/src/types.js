// @flow
import { type RRule } from 'rrule';

import { type AttachedEventFile } from '@kitman/common/src/utils/fileHelper';
import type {
  EventLink,
  EventAttachment,
  OpponentSquad,
  OpponentTeam,
  EventRecurrenceBasic,
  FieldCondition,
  GameSquad,
} from '@kitman/common/src/types/Event';
import { type EventLocationFull } from '@kitman/services/src/services/planning/getEventLocations';
import { type CustomEventTypeFull } from '@kitman/services/src/services/planning/getCustomEventTypes';
import type { ID } from '@kitman/components/src/Athletes/types';
import { type StaffVisibilityEnum } from '@kitman/modules/src/PlanningEventSidePanel/src/components/custom/utils';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import type { RecurrencePreferencesOptions } from '@kitman/services/src/services/planning/getRecurrencePreferences';

import type { QueuedLink } from '../../Medical/shared/components/AddDiagnosticLinkSidePanel/hooks/useDiagnosticLinkForm';
import {
  creatableEventTypeEnumLike,
  recurrenceChangeScopeEnumLike,
} from './enumLikes';

export type EditEventPanelMode = 'EDIT' | 'CREATE' | 'DUPLICATE';
export type CreatableEventType = $Values<typeof creatableEventTypeEnumLike>;
export type PanelType = 'EXPANDING' | 'SLIDING';
export type SaveRequestStatus = 'IDLE' | 'SUBMITTING' | 'FAILURE' | 'SUCCESS';

export type ValidityResult = {
  isInvalid: boolean,
  messages?: Array<string>,
};

export type SeasonType = {
  id: number,
  name: string,
  is_archived: boolean,
};

export type AttachedEventLink = {
  ...QueuedLink,
  event_attachment_category_ids: Array<number>,
};

export type EventNotificationChannels = {
  staff: Array<string>,
  athlete: Array<string>,
};

export type EventFormCommonAttributes = {
  id?: number, // planning event id
  title?: ?string,
  description?: ?string,
  duration: ?number,
  number_of_periods?: ?number,
  local_timezone: string,
  start_time: string,
  editable: boolean,
  athlete_events_count?: number,
  are_participants_duplicated?: boolean,
  no_participants?: boolean,
  event_collection_complete?: boolean,
  unUploadedFiles?: Array<AttachedEventFile>,
  unUploadedLinks?: Array<AttachedEventLink>,
  attachments?: Array<EventAttachment>,
  attached_links?: Array<EventLink>,
  event_location?: EventLocationFull,
  staff_id?: Array<number>,
  user_ids?: Array<number>,
  athlete_ids?: Array<ID>,
  manual_location?: string,
  duplicate_event_activities?: boolean,
  send_notifications?: boolean,
  notification_channels?: EventNotificationChannels,
};

export type EventFormCommonAttributesExact = $Exact<EventFormCommonAttributes>;

export type CommonAttributesValidity = {
  id?: ValidityResult,
  title?: ValidityResult,
  duration?: ValidityResult,
  local_timezone?: ValidityResult,
  start_time?: ValidityResult,
  event_location?: ValidityResult,
  staff_id?: ValidityResult,
  user_ids?: ValidityResult,
  unUploadedFiles?: ValidityResult,
  unUploadedLinks?: ValidityResult,
};

export type CommonAttributesValidityExact = $Exact<CommonAttributesValidity>;

export type EventFormConditions = {
  surface_type?: number,
  surface_quality?: number,
  weather?: number,
  temperature?: number,
  temperature_units?: 'F' | 'C',
  humidity?: number,
};

export type EventFormConditionsExact = $Exact<EventFormConditions>;

export type EventCustomOrgProperties = {
  nfl_location_id?: number,
  season_type_id?: number,
  nfl_surface_type_id?: number,
  nfl_equipment_id?: number,
  field_condition?: FieldCondition,
  nfl_surface_composition_id?: number,
  nfl_location_feed_id?: number,
};

export type EventCustomOrgPropertiesExact = $Exact<EventCustomOrgProperties>;

export type EventCustomOrgPropertiesValidity = {
  nfl_location_id?: ValidityResult,
  nfl_location_feed_id?: ValidityResult,
  season_type_id?: ValidityResult,
  nfl_surface_type_id?: ValidityResult,
  nfl_equipment_id?: ValidityResult,
  field_condition?: ValidityResult,
  nfl_surface_composition_id?: ValidityResult,
};

export type EventCustomOrgPropertiesValidityExact =
  $Exact<EventCustomOrgPropertiesValidity>;

export type EventConditionsValidity = {
  surface_type?: ValidityResult,
  surface_quality?: ValidityResult,
  weather?: ValidityResult,
  temperature?: ValidityResult,
  humidity?: ValidityResult,
};

export type EventConditionsValidityExact = $Exact<EventConditionsValidity>;

export type EventFormGameAttributes = {
  venue_type_id: ?number,
  competition_id: ?number,
  organisation_team_id: ?number,
  team_id: ?number,
  venue_type_id: ?number,
  score?: ?number,
  opponent_score?: ?number,
  round_number?: number,
  turnaround_prefix?: string,
  turnaround_fixture: boolean,
  event_collection_completed?: boolean,
  organisation_fixture_rating_id?: number,
  organisation_format_id?: ?number,
  competition_category_id?: number,
  competition?: {
    competition_categories: [],
    id: number,
    name: string,
  },
  competition_categories?: {
    id: number,
    name: string,
  },
  fas_game_key?: ?string,
  custom_periods: Array<GamePeriod>,
  opponent_team: OpponentTeam | null,
  opponent_squad: OpponentSquad | null,
  custom_opposition_name: string,
  custom_period_duration_enabled: boolean,
  squad?: GameSquad,
};

type EventFormGameAttributesExact = $Exact<EventFormGameAttributes>;

export type GameAttributesValidity = {
  venue_type_id?: ValidityResult,
  competition_id?: ValidityResult,
  organisation_team_id?: ValidityResult,
  team_id?: ValidityResult,
  score?: ValidityResult,
  opponent_score?: ValidityResult,
  round_number?: ValidityResult,
  turnaround_prefix?: ValidityResult,
  turnaround_fixture?: ValidityResult,
  competition_category_id?: ValidityResult,
  number_of_periods?: ValidityResult,
  organisation_format_id?: ValidityResult,
  organisation_fixture_rating_id?: ValidityResult,
  custom_periods?: ValidityResult,
  custom_opposition_name?: ValidityResult,
};

type GameAttributesValidityExact = $Exact<GameAttributesValidity>;

export type RecurrenceChangeScope = $Values<
  typeof recurrenceChangeScopeEnumLike
>;

export type SessionTypeReturn = {
  id: ?number,
  isJointSessionType: boolean,
  is_joint_practice?: boolean,
  sessionTypeCategoryName?: string,
};

export type EventFormSessionAttributes = {
  session_type_id: ?number,
  session_type?: SessionTypeReturn,
  season_type?: SeasonType,
  workload_type: number,
  game_day_minus?: number | null,
  game_day_plus?: number | null,
  team_id?: ?number,
  venue_type_id?: ?number,
  theme_type?: ?string,
  theme_id?: ?number,
  theme?: ?{
    id: number,
    name: string,
  },
  event_collection_completed?: boolean,
  recurrence?: {
    ...EventRecurrenceBasic,
    rule: RRule,
    scope?: RecurrenceChangeScope,
    recurrence_preferences?: RecurrencePreferencesOptions,
  },
};

type EventFormSessionAttributesExact = $Exact<EventFormSessionAttributes>;

export type SessionAttributesValidity = {
  session_type_id?: ValidityResult,
  workload_type?: ValidityResult,
  game_day_minus?: ValidityResult,
  game_day_plus?: ValidityResult,
  team_id?: ValidityResult,
  venue_type_id?: ValidityResult,
};

type SessionAttributesValidityExact = $Exact<SessionAttributesValidity>;

export type CustomEventAttributes = {
  custom_event_type?: CustomEventTypeFull,
  recurrence?: {
    ...EventRecurrenceBasic,
    rule: RRule,
    scope?: RecurrenceChangeScope,
  },
  staff_visibility?: StaffVisibilityEnum,
  visibility_ids?: Array<number>,
  field_condition?: FieldCondition,
};

type CustomEventAttributesExact = $Exact<CustomEventAttributes>;

export type CustomEventAttributesValidity = {
  custom_event_type?: ValidityResult,
  user_ids?: ValidityResult,
  visibility_ids?: ValidityResult,
};

type CustomEventAttributesValidityExact = $Exact<CustomEventAttributesValidity>;
export type EventGameFormData = {
  type: 'game_event',
  league_setup?: boolean,
  workload_units?: ?Object,
  ...EventFormCommonAttributesExact,
  ...EventFormConditionsExact,
  ...EventCustomOrgPropertiesExact,
  ...EventFormGameAttributesExact,
};

export type EventGameFormValidity = {
  type: 'game_event',
  ...CommonAttributesValidityExact,
  ...EventConditionsValidityExact,
  ...EventCustomOrgPropertiesValidityExact,
  ...GameAttributesValidityExact,
};

export type EventSessionFormData = {
  type: 'session_event',
  workload_units?: ?Object,
  ...EventFormCommonAttributesExact,
  ...EventFormConditionsExact,
  ...EventCustomOrgPropertiesExact,
  ...EventFormSessionAttributesExact,
};

export type EventSessionFormValidity = {
  type: 'session_event',
  ...CommonAttributesValidityExact,
  ...EventConditionsValidityExact,
  ...EventCustomOrgPropertiesValidityExact,
  ...SessionAttributesValidityExact,
};

export type CustomEventFormData = {
  type: 'custom_event',
  ...EventFormCommonAttributesExact,
  ...CustomEventAttributesExact,
};

export type CustomEventFormValidity = {
  type: 'custom_event',
  ...CommonAttributesValidityExact,
  ...CustomEventAttributesValidityExact,
};

export type GameTrainingEventFormData =
  | EventGameFormData
  | EventSessionFormData;

export type EventFormData = GameTrainingEventFormData | CustomEventFormData;

export type EventFormValidity =
  | EventGameFormValidity
  | EventSessionFormValidity;

export type EventFormValidityResult = {
  isValid: boolean,
  validation?: EventFormValidity | CustomEventFormValidity,
};

export type OnUpdateEventStartTime = (dateTime: string) => void;
export type OnUpdateEventDuration = (duration: ?string | ?number) => void;
export type OnUpdateEventDate = (date: string) => void;
export type OnUpdateEventTimezone = (timezone: string) => void;
export type OnUpdateEventTitle = (
  title: string,
  shouldChangeEvent: boolean
) => void;

// "Object" is the type used in the wild. Tried defining a more narrow one, Flow causes problems.
export type OnUpdateEventDetails = (details: Object) => void;

export type OnUpdateEventNotificationChannels = (
  notificationChannels: EventNotificationChannels | null
) => void;
