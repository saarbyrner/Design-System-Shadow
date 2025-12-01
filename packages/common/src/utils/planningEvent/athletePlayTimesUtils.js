// @flow

import structuredClone from 'core-js/stable/structured-clone';
import type {
  AthletePlayTime,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';

export const getManualAthletePlayTimeForPeriod = (
  athleteId: number,
  athletePlayTimes: ?Array<AthletePlayTime>,
  periodId: number
) =>
  athletePlayTimes?.find(
    (playerTime) =>
      playerTime.athlete_id === athleteId &&
      playerTime.game_period_id === periodId
  );

export const handleAthletePlayTimeDeletion = (
  athletePlayTimes: Array<AthletePlayTime>,
  indexToDelete: number
) => {
  const currentAthletePlayTimes = structuredClone(athletePlayTimes);

  // Handle saved athlete play time deletion
  if (currentAthletePlayTimes[indexToDelete].id) {
    currentAthletePlayTimes[indexToDelete] = {
      ...currentAthletePlayTimes[indexToDelete],
      minutes: 0,
      delete: true,
    };
    // handle local athlete play time Deletion
  } else {
    currentAthletePlayTimes.splice(indexToDelete, 1);
  }
  return currentAthletePlayTimes;
};

export const updateAthletePlayTimeMinutes = ({
  athletePlayTimes,
  currentPeriod,
  athleteId,
  manualTime,
}: {
  athletePlayTimes: Array<AthletePlayTime>,
  currentPeriod: GamePeriod,
  athleteId: number,
  manualTime: number,
}) => {
  let currentAthletePlayTimes = structuredClone(athletePlayTimes);

  // gets the index of the manual play time to update
  const athletePlayTimeIndexToUpdate = currentAthletePlayTimes.findIndex(
    (playTimes) =>
      playTimes.game_period_id === currentPeriod.id &&
      playTimes.athlete_id === athleteId
  );

  if (athletePlayTimeIndexToUpdate >= 0) {
    // if the index exists check if the substitute play time needs to be deleted
    if (
      !(
        manualTime ||
        currentAthletePlayTimes[athletePlayTimeIndexToUpdate].position_id
      )
    ) {
      currentAthletePlayTimes = handleAthletePlayTimeDeletion(
        currentAthletePlayTimes,
        athletePlayTimeIndexToUpdate
      );
    } else {
      // updates the minutes for the respective athletes play time
      currentAthletePlayTimes[athletePlayTimeIndexToUpdate] = {
        ...currentAthletePlayTimes[athletePlayTimeIndexToUpdate],
        minutes: manualTime,
      };
    }
  } else if (manualTime > 0) {
    // creates a new athlete play time locally if one does not exist (only occurs for subs)
    currentAthletePlayTimes.push({
      minutes: manualTime,
      athlete_id: athleteId,
      game_period_id: currentPeriod.id,
    });
  }

  return currentAthletePlayTimes;
};
