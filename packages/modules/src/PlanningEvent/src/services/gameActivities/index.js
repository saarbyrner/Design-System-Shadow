// @flow
import $ from 'jquery';
import type {
  GameActivity,
  GameActivityKind,
} from '@kitman/common/src/types/GameEvent';

export type FieldValidation = {
  valid: boolean,
  showError: boolean,
};

export type GameActivityForm = {
  id?: ?number,
  minute: number,
  absolute_minute: number,
  game_activity_id?: ?number,
  kind?: GameActivityKind,
  athlete_id?: ?number,
  relation_id?: ?(number | string),
  relation?: {
    id: ?number,
  },
  game_activities?: ?Array<GameActivity>,
  validation: {
    minute: FieldValidation,
    relation_id: FieldValidation,
  },
};

export type GameActivityDeletion = {
  id: number,
  delete: true,
};

export const getGameActivities = ({
  eventId,
  supervisorView,
}: {
  eventId: number,
  supervisorView?: boolean,
}): Promise<Array<GameActivity>> => {
  return new Promise((resolve, reject) => {
    let url = `/ui/planning_hub/events/${eventId}/game_activities`;

    if (supervisorView) {
      url += '?supervisor_view=true';
    }

    $.ajax({
      method: 'GET',
      url,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const getGamePeriodActivities = (
  eventId: number,
  periodId: string | number
): Promise<Array<GameActivity>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/events/${eventId}/game_periods/${periodId}/v2/game_activities`,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const createGameActivity = (
  eventId: number,
  gameActivity: GameActivityForm
): Promise<GameActivity> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_activities`,
      contentType: 'application/json',
      data: JSON.stringify(gameActivity),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const updateGameActivity = (
  eventId: number,
  gameActivity: GameActivity
): Promise<GameActivity> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/ui/planning_hub/events/${eventId}/game_activities/${
        gameActivity.id || ''
      }`,
      contentType: 'application/json',
      data: JSON.stringify(gameActivity),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const gameActivitiesBulkSave = (
  eventId: number,
  gameActivities: Array<GameActivityForm | GameActivityDeletion>
): Promise<Array<GameActivity>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_activities/bulk_save`,
      contentType: 'application/json',
      data: JSON.stringify({ game_activities: gameActivities }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const gameActivitiesPeriodBulkSave = (
  eventId: number,
  periodId: number,
  gameActivities: Array<GameActivityForm | GameActivityDeletion>
): Promise<Array<GameActivity>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/game_periods/${periodId}/v2/game_activities/bulk_save`,
      contentType: 'application/json',
      data: JSON.stringify({ game_activities: gameActivities }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};
