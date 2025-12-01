// @flow
import { RRule } from 'rrule';

import type {
  Event as PlanningEvent,
  TrainingSession,
  Game,
  CustomEvent,
  FieldCondition,
} from '@kitman/common/src/types/Event';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import { emptyRecurrence } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

import type {
  EventFormData,
  EventFormCommonAttributes,
  EventFormCommonAttributesExact,
  EventFormConditionsExact,
  EventCustomOrgPropertiesExact,
  CustomEventFormData,
  SessionTypeReturn,
} from './types';
import {
  StaffVisibilityOptions,
  excludeAttendees,
} from './components/custom/utils';
import type { StaffVisibilityEnum } from './components/custom/utils';
import { LOCAL_CUSTOM_OPPOSITION_OPTION_ID } from './components/gameLayoutV2/gameFieldsUtils';

const DEFAULT_NUM_OF_PERIODS = 2;

export const getAreArraysEqual = (a: Array<number>, b: Array<number>) => {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  const bSet = new Set(b);
  return [...aSet].every((id) => bSet.has(id));
};

export const calculateStaffVisibilityValue = (
  visibilityIds: Array<number>,
  userIds: Array<number>
): StaffVisibilityEnum => {
  // if the visibility id's is empty, the all staff radio should be auto filled
  if (!visibilityIds?.length) {
    return StaffVisibilityOptions.allStaff;
  }

  // if the user id's and visibility id's are exactly the same, the selected staff radio should be auto filled
  if (getAreArraysEqual(visibilityIds, userIds)) {
    return StaffVisibilityOptions.onlySelectedStaff;
  }

  // all other combinations will be selected and additional
  return StaffVisibilityOptions.selectedStaffAndAdditional;
};

export const getOrganisationFormatId = (event: PlanningEvent | CustomEvent) => {
  if (event.type === 'game_event') {
    const hasFormatButNoFormatId =
      event.organisation_format && !event.organisation_format_id;

    if (event.organisation_format_id) {
      return { organisation_format_id: event.organisation_format_id };
    }
    if (hasFormatButNoFormatId) {
      return { organisation_format_id: event.organisation_format?.id };
    }
    return { organisation_format_id: undefined };
  }
  return {}; // should return undefined, because the result is spread
};

export const getFieldCondition = (
  event: TrainingSession | Game | TrainingSession
): FieldCondition => {
  const condition = event?.field_condition;
  switch (typeof condition) {
    case 'number':
      return condition;
    case 'object': {
      const id = condition?.id;
      if (typeof id === 'number') return id;
      return condition;
    }

    default:
      return condition;
  }
};

const convertEventToCommonFormData = (event: PlanningEvent) => {
  const common: EventFormCommonAttributesExact = {
    id: event.id,
    duration: event.duration != null ? event.duration : null,
    title: event.name,
    description: event.description,
    local_timezone: event.local_timezone,
    start_time: event.start_date,
    editable: event.editable ? event.editable : false,
    athlete_events_count: event.athlete_events_count,
    are_participants_duplicated: event.are_participants_duplicated,
    duplicate_event_activities: event.duplicate_event_activities,
    no_participants: event.no_participants,
    event_collection_complete: event.event_collection_complete || false,
    event_location: event.event_location,
    athlete_ids: event.athlete_ids,
    user_ids: event.user_ids,
  };
  return common;
};

export const parseRepeatRule = (repeatRule: RRule | string | void) => {
  let repeatRuleParsed: RRule | void;
  try {
    repeatRuleParsed =
      typeof repeatRule === 'string'
        ? RRule.fromString(repeatRule)
        : repeatRule;
  } catch {
    repeatRuleParsed = undefined;
  }
  return repeatRuleParsed;
};

const getVisibility = (
  event: CustomEvent,
  { user_ids: userIds }: EventFormCommonAttributes
) => {
  const {
    visibility_ids: eventVisibilityIds,
    staff_visibility: eventStaffVisibility,
  } = event;

  let staffVisibility: StaffVisibilityEnum | void;
  let visibilityIds: Array<number> | void;
  if (window.featureFlags['staff-visibility-custom-events']) {
    if (eventStaffVisibility) {
      staffVisibility = eventStaffVisibility;
    } else {
      staffVisibility = calculateStaffVisibilityValue(
        eventVisibilityIds,
        userIds ?? []
      );
    }

    if (staffVisibility === StaffVisibilityOptions.selectedStaffAndAdditional) {
      visibilityIds = excludeAttendees(eventVisibilityIds, userIds);
    } else {
      visibilityIds = eventVisibilityIds;
    }
  }
  return { visibilityIds, staffVisibility };
};

const convertCustomEventToEventFormData = (
  event: CustomEvent,
  commonFormData: EventFormCommonAttributes
): CustomEventFormData => {
  const repeatRuleParsed = parseRepeatRule(event.recurrence?.rule);
  const { staffVisibility, visibilityIds } = getVisibility(
    event,
    commonFormData
  );

  return {
    ...commonFormData,
    type: event.type,
    custom_event_type: event.custom_event_type,
    recurrence:
      repeatRuleParsed && event.recurrence
        ? { ...event.recurrence, rule: repeatRuleParsed }
        : undefined,
    staff_visibility: staffVisibility ?? undefined,
    visibility_ids: visibilityIds ?? undefined,
  };
};

const parsePossiblyStringTypeNumber = (
  possiblyStringTypeNumber: string | number
) =>
  typeof possiblyStringTypeNumber === 'string'
    ? Number.parseInt(possiblyStringTypeNumber, 10)
    : possiblyStringTypeNumber;

type GameAndSessionFormCommon = $Exact<{
  ...EventFormCommonAttributesExact,
  ...EventFormConditionsExact,
  ...EventCustomOrgPropertiesExact,
}>;

const convertSurfaceAndCustomOrgFields = (
  event: TrainingSession | Game,
  commonFormData: EventFormCommonAttributesExact
): GameAndSessionFormCommon => ({
  ...commonFormData,
  surface_type: event.surface_type?.id,
  surface_quality: event.surface_quality?.id,
  weather: event.weather?.id,
  temperature:
    typeof event.temperature === 'string'
      ? Number.parseFloat(event.temperature)
      : event.temperature,
  humidity: event.humidity,

  // custom org fields
  nfl_surface_type_id: event.nfl_surface_type_id
    ? parsePossiblyStringTypeNumber(event.nfl_surface_type_id)
    : undefined,
  nfl_equipment_id: event.nfl_equipment_id
    ? parsePossiblyStringTypeNumber(event.nfl_equipment_id)
    : undefined,
  nfl_location_id: event.nfl_location_id
    ? parsePossiblyStringTypeNumber(event.nfl_location_id)
    : undefined,
  nfl_location_feed_id:
    event.nfl_location_feed?.id ?? event.nfl_location_feed_id ?? undefined,
  field_condition: getFieldCondition(event),
  nfl_surface_composition_id:
    event.nfl_surface_composition?.id ?? event.nfl_surface_composition_id,
});

const getConvertedCustomOppositionName = (event: Game) => {
  if (event?.opponent_team?.custom) return event.opponent_team.name;
  if (
    event.opponent_team?.id === LOCAL_CUSTOM_OPPOSITION_OPTION_ID &&
    event.custom_opposition_name
  )
    return event.custom_opposition_name;

  return '';
};

const getConvertedNumberOfPeriods = ({
  event,

  activeEventPeriods,
  isCalendarMode,
}: {
  event: Game,
  activeEventPeriods: Array<GamePeriod>,
  isCalendarMode?: boolean,
}) => {
  if (!isCalendarMode && activeEventPeriods?.length) {
    return activeEventPeriods?.length;
  }

  return event.number_of_periods ?? DEFAULT_NUM_OF_PERIODS;
};

const convertGameToEventFormData = ({
  event,
  commonFormData,
  activeEventPeriods,
  isCalendarMode,
}: {
  event: Game,
  commonFormData: GameAndSessionFormCommon,
  activeEventPeriods: Array<GamePeriod>,
  isCalendarMode?: boolean,
}) => {
  return {
    ...commonFormData,
    ...getOrganisationFormatId(event),
    type: event.type,
    venue_type_id: event.venue_type?.id,
    competition_id: event.competition?.id,
    organisation_team_id: event.organisation_team?.id,
    team_id: event.opponent_squad?.id || event.opponent_team?.id,
    number_of_periods: getConvertedNumberOfPeriods({
      event,
      activeEventPeriods,
      isCalendarMode,
    }),
    // organisation_fixture_rating_id is the value set locally before it is saved
    // organisation_fixture_rating?.id is the value coming from the BE after saving the event details
    organisation_fixture_rating_id:
      event.organisation_fixture_rating_id ||
      event.organisation_fixture_rating?.id ||
      undefined,
    score: event.score != null ? event.score : 0,
    opponent_score: event.opponent_score != null ? event.opponent_score : 0,
    round_number: event.round_number != null ? event.round_number : undefined,
    turnaround_fixture:
      event.turnaround_fixture != null ? event.turnaround_fixture : true,
    turnaround_prefix:
      event.turnaround_prefix != null ? event.turnaround_prefix : undefined,
    workload_units: event.workload_units,
    competition_category: event.competition_category,
    competition: event.competition,
    competition_category_id: event.competition_category_id,
    fas_game_key: event.fas_game_key,
    opponent_squad: event.opponent_squad,
    opponent_team: event.opponent_squad ? null : event.opponent_team,
    mls_game_key: event.mls_game_key,
    custom_periods: event?.custom_periods || activeEventPeriods,
    custom_opposition_name: getConvertedCustomOppositionName(event),
    custom_period_duration_enabled: !!event?.custom_period_duration_enabled,
    league_setup: !!event?.league_setup,
    squad: event.squad,
  };
};

const getSessionType = (event: TrainingSession): SessionTypeReturn => {
  if (event.session_type) {
    const {
      id,
      sessionTypeCategoryName,
      is_joint_practice: isJointPractice,
      isJointSessionType,
      name,
    } = event.session_type;

    return {
      id,
      sessionTypeCategoryName,
      isJointSessionType: isJointPractice ?? isJointSessionType,
      name,
    };
  }

  return {
    id: null,
    isJointSessionType: false,
  };
};

const convertSessionToEventFormData = (
  event: TrainingSession,
  commonFormData: GameAndSessionFormCommon,
  isDuplicate: boolean
) => {
  const repeatRuleParsed = parseRepeatRule(event?.recurrence?.rule);

  return {
    ...commonFormData,
    type: 'session_event',
    session_type_id: event.session_type?.id,
    session_type: getSessionType(event),
    theme_type: event.theme_type,
    theme_id: event.theme_id,
    theme: event.theme,
    team_id:
      event.session_type?.isJointSessionType ||
      event.session_type?.is_joint_practice
        ? event.opponent_squad?.id || event.opponent_team?.id
        : null,
    venue_type_id:
      event.session_type?.isJointSessionType ||
      event.session_type?.is_joint_practice
        ? event.venue_type?.id
        : null,
    workload_type: event.workload_type,
    game_day_minus: parsePossiblyStringTypeNumber(event.game_day_minus),
    game_day_plus: parsePossiblyStringTypeNumber(event.game_day_plus),
    workload_units: event.workload_units,
    season_type_id: event.season_type?.id,
    season_type: event.season_type,
    field_condition: getFieldCondition(event),
    recurrence:
      repeatRuleParsed && event.recurrence && !isDuplicate
        ? { ...event.recurrence, rule: repeatRuleParsed }
        : emptyRecurrence,
  };
};

export const convertPlanningEventToEventFormData = ({
  event,
  activeEventPeriods,
  isCalendarMode,
  isDuplicate,
}: {
  event: PlanningEvent,
  activeEventPeriods: Array<GamePeriod>,
  isCalendarMode?: boolean,
  isDuplicate: boolean,
}): EventFormData => {
  const commonFormData = convertEventToCommonFormData(event);
  if (event.user_ids !== null && event.user_ids !== undefined) {
    commonFormData.user_ids = event.user_ids;
  } else if (event.event_users !== null && event.event_users !== undefined) {
    commonFormData.user_ids = event.event_users.map(
      (eventUser) => eventUser?.user?.id
    );
  }

  if (event.unUploadedFiles != null) {
    commonFormData.unUploadedFiles = event.unUploadedFiles;
  }

  if (event.unUploadedLinks != null) {
    commonFormData.unUploadedLinks = event.unUploadedLinks;
  }

  if (event.attachments != null) {
    commonFormData.attachments = event.attachments;
  }

  if (event.attached_links != null) {
    commonFormData.attached_links = event.attached_links;
  }

  if (event.type === 'custom_event') {
    return convertCustomEventToEventFormData(event, commonFormData);
  }

  const formData = convertSurfaceAndCustomOrgFields(event, commonFormData);

  // Custom org fields
  if (event.type === 'game_event') {
    return convertGameToEventFormData({
      event,
      commonFormData: formData,
      activeEventPeriods,
      isCalendarMode,
    });
  }

  // Training session
  return convertSessionToEventFormData(event, formData, isDuplicate);
};
