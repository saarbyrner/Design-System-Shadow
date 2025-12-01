// @flow
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { GamePeriodDuration } from '../../../types';

export const sumTotalMinutesByPosition = (
  gameActivities: Array<GameActivity>,
  periodStart: number,
  periodEnd: number,
  positionId: string
) => {
  const gameActivitiesOrdered = gameActivities.sort(
    (a, b) => Number(a.absolute_minute) - Number(b.absolute_minute)
  );

  if (gameActivitiesOrdered.length > 0) {
    let duration = 0;
    let i = 0;
    gameActivitiesOrdered.forEach((gameActivity) => {
      if (String(gameActivity.relation?.id) === positionId) {
        if (
          i < gameActivitiesOrdered.length - 1 &&
          String(gameActivitiesOrdered[i + 1].relation?.id) !== positionId
        ) {
          duration +=
            parseInt(gameActivitiesOrdered[i + 1].absolute_minute, 10) -
            parseInt(gameActivity.absolute_minute, 10);
        } else {
          duration +=
            parseInt(periodEnd, 10) -
            parseInt(gameActivity.absolute_minute, 10);
        }
      }
      i += 1;
    });

    return duration;
  }

  return 0;
};

export const sumTotalMinutes = (
  gameActivities: Array<GameActivity>,
  periodStart: number,
  periodEnd: number
) => {
  // order the activities to make sure we calculate duration correctly

  const gameActivitiesOrdered = gameActivities.sort(
    (a, b) => Number(a.absolute_minute) - Number(b.absolute_minute)
  );

  let duration = 0;
  if (gameActivitiesOrdered.length > 0) {
    for (let i = 0; i < gameActivitiesOrdered.length; i++) {
      if (
        gameActivitiesOrdered[i].relation?.id &&
        gameActivitiesOrdered[i].relation?.id !== 'SUBSTITUTE'
      ) {
        const thisPositionStartTime = parseInt(
          gameActivitiesOrdered[i].absolute_minute,
          10
        );
        const thisPositionEndTime =
          i < gameActivitiesOrdered.length - 1
            ? parseInt(gameActivitiesOrdered[i + 1].absolute_minute, 10)
            : parseInt(periodEnd, 10);
        duration +=
          parseInt(thisPositionEndTime, 10) -
          parseInt(thisPositionStartTime, 10);
      }
    }

    return duration;
  }

  return 0;
};

export const getPeriodDurations = (
  allPeriods: Array<GamePeriod>
): Array<GamePeriodDuration> => {
  const orderedPeriods = [...allPeriods].sort((a, b) => a.order - b.order);
  let periodstart = 0;
  const arrDurations = [];
  orderedPeriods.forEach((a) => {
    arrDurations.push({
      min: periodstart,
      max: periodstart + a.duration,
      id: a.id,
    });
    periodstart += a.duration;
  });

  return arrDurations;
};
