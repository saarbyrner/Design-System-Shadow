// @flow

import type { DropdownItem } from '@kitman/components/src/types';
import type { TrainingSession as TrainingSessionEvent } from '@kitman/common/src/types/Event';
import type { TrainingSession } from './types';

export const transformTrainingSessionEvent = (event: TrainingSessionEvent) => {
  const gameDays = [];
  if (event.game_day_plus && event.game_day_plus !== '0') {
    gameDays.push(`+${event.game_day_plus}`);
  }

  if (event.game_day_minus && event.game_day_minus !== '0') {
    gameDays.push(`-${event.game_day_minus}`);
  }

  if (event.game_day_minus === '0' || event.game_day_plus === '0') {
    gameDays.push('0');
  }

  return {
    eventType: 'TRAINING_SESSION',
    id: event.id,
    date: event.start_date,
    sessionTypeId: event.session_type.id,
    workloadType: event.workload_type,
    duration: event.duration,
    localTimezone: event.local_timezone,
    gameDays,
    surfaceType: event.surface_type?.id || null,
    surfaceQuality: event.surface_quality?.id || null,
    weather: event.weather?.id || null,
    temperature: event.temperature,
  };
};
export const transformTrainingSession = (trainingSession: {
  id: number,
  date: string,
  session_type_id: string,
  session_type_name: string,
  workload_type: string,
  workload_type_name: string,
  duration: string,
  local_timezone: string,
  game_day_plus: string,
  game_day_minus: string,
  surface_type: string,
  surface_quality: string,
  weather: string,
  temperature: string,
}) => {
  const gameDays = [];
  if (trainingSession.game_day_plus && trainingSession.game_day_plus !== '0') {
    gameDays.push(`+${trainingSession.game_day_plus}`);
  }

  if (
    trainingSession.game_day_minus &&
    trainingSession.game_day_minus !== '0'
  ) {
    gameDays.push(`-${trainingSession.game_day_minus}`);
  }

  if (
    trainingSession.game_day_minus === '0' ||
    trainingSession.game_day_plus === '0'
  ) {
    gameDays.push('0');
  }

  return {
    eventType: 'TRAINING_SESSION',
    id: trainingSession.id,
    date: trainingSession.date,
    sessionTypeId: trainingSession.session_type_id,
    workloadType: trainingSession.workload_type,
    duration: trainingSession.duration,
    localTimezone: trainingSession.local_timezone,
    gameDays,
    surfaceType: trainingSession.surface_type,
    surfaceQuality: trainingSession.surface_quality,
    weather: trainingSession.weather,
    temperature: trainingSession.temperature,
  };
};

export const transformTrainingSessionRequest = (
  trainingSession: TrainingSession
) => {
  const gameDays: {
    game_day_plus: ?string,
    game_day_minus: ?string,
  } = {
    game_day_plus: null,
    game_day_minus: null,
  };

  if (trainingSession.gameDays) {
    trainingSession.gameDays.forEach((gameDay) => {
      if (gameDay.includes('+')) {
        gameDays.game_day_plus = gameDay.replace('+', '');
      } else if (gameDay.includes('-')) {
        gameDays.game_day_minus = gameDay.replace('-', '');
      } else if (gameDay === '0') {
        gameDays.game_day_plus = gameDays.game_day_plus || '0';
        gameDays.game_day_minus = gameDays.game_day_minus || '0';
      }
    });
  }

  return {
    type: 'session_event',
    start_time: trainingSession.date,
    duration: trainingSession.duration,
    local_timezone: trainingSession.localTimezone,
    game_day_minus: gameDays.game_day_minus,
    game_day_plus: gameDays.game_day_plus,
    workload_type: trainingSession.workloadType,
    session_type_id: trainingSession.sessionTypeId,
    surface_type: trainingSession.surfaceType,
    surface_quality: trainingSession.surfaceQuality,
    weather: trainingSession.weather,
    temperature: trainingSession.temperature,
  };
};

export const fromArrayToDropdownItems = (
  array: Array<{ id: number, name: string }>
): Array<DropdownItem> => {
  const items = array.map((item) => ({
    id: item.id.toString(),
    title: item.name,
  }));
  return items;
};
