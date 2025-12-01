/* eslint-disable camelcase */
// @flow
import moment from 'moment-timezone';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

import { allValidSession } from './validation/validateSession';
import { allValidGame } from './validation/validateGame';
import type {
  EventFormData,
  CreatableEventType,
  EventFormValidity,
  EventGameFormData,
  EventSessionFormData,
  CustomEventFormValidity,
} from './types';
import { allValidCustomEvent } from './validation/validateCustomEvent';
import { StaffVisibilityOptions } from './components/custom/utils';
import { creatableEventTypeEnumLike } from './enumLikes';

const defaultTimeInfo = (defaultDuration: number) => {
  const localTimezone =
    document.getElementsByTagName('body')[0].dataset.timezone;

  const start = localTimezone ? moment().tz(localTimezone) : moment();

  return {
    local_timezone: localTimezone || start.tz(),
    start_time: start.format(DateFormatter.dateTransferFormat),
    duration: defaultDuration,
  };
};

const gameEventConstFields = {
  type: 'game_event',
  title: '',
  venue_type_id: null,
  competition_id: null,
  organisation_team_id: null,
  team_id: null,
  turnaround_prefix: '',
  turnaround_fixture: true,
  editable: true,
  number_of_periods: 1,
  custom_periods: [],
  custom_opposition_name: '',
  custom_period_duration_enabled: false,
  opponent_squad: null,
  opponent_team: null,
  league_setup: false,
};

const createBlankGame = (
  defaultDuration: number,
  isGameDetailsV2: boolean
): EventGameFormData => {
  const blankGame = {
    ...defaultTimeInfo(defaultDuration),
    ...gameEventConstFields,
    athlete_ids: [],
    user_ids: [],
  };
  const getDefaultScoreAndPeriod = {
    ...blankGame,
    score: 0,
    opponent_score: 0,
    number_of_periods: 2,
  };

  const updatedGameData = isGameDetailsV2
    ? getDefaultScoreAndPeriod
    : blankGame;

  return updatedGameData;
};

const createBlankSession = (defaultDuration: number): EventSessionFormData => {
  return {
    ...defaultTimeInfo(defaultDuration),
    type: 'session_event',
    session_type_id: null,
    title: '',
    workload_type: 1,
    editable: true,
    athlete_ids: [],
    user_ids: [],
  };
};

const createBlankCustomEvent = (defaultDuration: number): any => {
  return {
    ...defaultTimeInfo(defaultDuration),
    type: 'custom_event',
    title: '',
    editable: true,
    athlete_ids: [],
    user_ids: [],
    ...(window.featureFlags['staff-visibility-custom-events']
      ? {
          staff_visibility: StaffVisibilityOptions.allStaff,
          visibility_ids: [],
        }
      : {}),
  };
};

export const createInitialValidation = (
  eventType: ?CreatableEventType
): EventFormValidity | CustomEventFormValidity => {
  switch (eventType) {
    case creatableEventTypeEnumLike.Game:
      return allValidGame;
    case creatableEventTypeEnumLike.Session:
      return allValidSession;
    case creatableEventTypeEnumLike.CustomEvent:
      return allValidCustomEvent;
    default:
      return allValidSession;
  }
};

export const createInitialEvent = (
  isGameDetailsV2: boolean,
  eventType: ?CreatableEventType,
  defaultDuration: number,
  defaultGameDuration: ?number
): EventFormData => {
  switch (eventType) {
    case creatableEventTypeEnumLike.Game:
      return createBlankGame(
        defaultGameDuration || defaultDuration,
        isGameDetailsV2
      );
    case creatableEventTypeEnumLike.Session:
      return createBlankSession(defaultDuration);
    case creatableEventTypeEnumLike.CustomEvent:
      return createBlankCustomEvent(defaultDuration);
    default:
      return createBlankSession(defaultDuration);
  }
};

// Future = further than today
export const isEventDateInFuture = (event: Object) => {
  const startTimeWithTimezone = moment.tz(
    event.start_time,
    event.local_timezone
  );
  return startTimeWithTimezone.isAfter(moment().endOf('day'));
};

const sanitizeGameEvent = (event: EventGameFormData) => {
  const isFutureEvent = isEventDateInFuture(event);
  const {
    score,
    opponent_score,
    number_of_periods,
    ...restEvent
  }: EventGameFormData = event;
  if (restEvent.opponent_squad) {
    restEvent.opponent_team = null;
  }

  return {
    ...restEvent,
    number_of_periods: +number_of_periods,
    // Be sure not to save game scores if event is in the future
    ...(isFutureEvent
      ? {}
      : {
          score,
          opponent_score,
        }),
  };
};

const sanitizeSessionEvent = (event: EventSessionFormData) => {
  const { game_day_minus, game_day_plus } = event;
  return {
    ...event,
    // Be sure game day minus and plus are positive numbers when submitted
    game_day_minus: game_day_minus != null ? Math.abs(game_day_minus) : null,
    game_day_plus: game_day_plus != null ? Math.abs(game_day_plus) : null,
  };
};

export const sanitizeEvent = (event: EventFormData): EventFormData => {
  switch (event.type) {
    case 'game_event':
      return sanitizeGameEvent(event);
    case 'session_event':
      return sanitizeSessionEvent(event);

    default:
      return event;
  }
};
