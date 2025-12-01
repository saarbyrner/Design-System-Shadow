// @flow
import { isEqual, differenceWith } from 'lodash';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import saveAllPeriodGameActivities from '@kitman/modules/src/PlanningEvent/src/services/saveAllPeriodGameActivities';

import {
  findFormationForPeriod,
  findPeriodFormationCompleteActivity,
  findPeriodPlayerPitchChangeActivities,
  getCaptainForTeamActivity,
} from './gameActivityUtils';

export const getCurrentLocalPeriods = (
  periods: Array<GamePeriod>
): Array<GamePeriod> => periods.filter((period) => !period?.delete);

export const getPeriodDurationInfo = (
  periods: Array<GamePeriod>,
  addDuration: boolean,
  duration?: number | null
) => {
  let durationSum = duration;
  const newNumOfPeriods = addDuration ? periods.length + 1 : periods.length - 1;
  if (!durationSum)
    durationSum = periods.reduce((sum, period) => {
      return sum + period.duration;
    }, 0);

  const newPeriodDuration = Math.floor(durationSum / newNumOfPeriods);
  const newPeriodsDurationSum = (newNumOfPeriods - 1) * newPeriodDuration;
  const newPeriodFinalDuration = durationSum - newPeriodsDurationSum;
  return {
    newNumOfPeriods,
    newPeriodDuration,
    newPeriodFinalDuration,
    newPeriodFinalTime: durationSum,
  };
};

export const clearPeriodActivities = ({
  gameActivities,
  currentPeriod,
  isEventListShown,
  isLastPeriodSelected,
}: {
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod,
  isEventListShown?: boolean,
  isLastPeriodSelected?: boolean,
}) => {
  const inRange = (num, start, end) => {
    const inEndRangeCheck = isLastPeriodSelected ? num <= end : num < end;
    return num >= start && inEndRangeCheck;
  };

  //  loop over current game activities and delete ones which haven't been saved yet,
  //  and mark already saved activities as with a "delete" prop
  //  This is so when we hit "save Progress" we can update the backend to remove from the db

  return gameActivities.reduce((current, activity) => {
    const activityInPeriod = inRange(
      +activity.absolute_minute,
      +currentPeriod?.absolute_duration_start,
      +currentPeriod?.absolute_duration_end
    );

    const isActivityAPitchAssignmentActivity = [
      eventTypes.formation_complete,
      eventTypes.position_change,
      eventTypes.formation_position_view_change,
    ].includes(activity.kind);

    const isNotALinkedFormationChange = !activity.game_activity_id;

    const isAStartingLineupInThisPeriodActivity =
      activityInPeriod &&
      isActivityAPitchAssignmentActivity &&
      isNotALinkedFormationChange;

    const isPeriodStartingFormation =
      activity.kind === eventTypes.formation_change &&
      +activity.absolute_minute === currentPeriod?.absolute_duration_start;

    const isPitchActivityKept = isEventListShown
      ? !activityInPeriod || isAStartingLineupInThisPeriodActivity
      : !activityInPeriod;

    const isCaptainActivity = activity.kind === eventTypes.captain_assigned;

    const checkIfActivityIsKept =
      isPitchActivityKept || isPeriodStartingFormation || isCaptainActivity;

    if (checkIfActivityIsKept) {
      return [...current, activity];
    }

    if (activityInPeriod && activity.id) {
      return [...current, { ...activity, delete: true }];
    }

    return current;
  }, []);
};

const updateAndRemoveActivitiesFromRecalculation = (
  gameActivities: Array<GameActivity>,
  activitiesToRemoveIndexes: Array<number>,
  activitiesToUpdateIndexes: Array<number>,
  newStartTime: number
) => {
  let updatedActivities = [...gameActivities];
  // Loop that handles removing the activities locally so that they do not display for the user and can be deleted when saved
  activitiesToRemoveIndexes.forEach((index) => {
    if (gameActivities[index]?.id) {
      updatedActivities[index] = {
        ...updatedActivities[index],
        delete: true,
      };
    } else {
      updatedActivities = updatedActivities.filter(
        (activity) => !isEqual(activity, updatedActivities[index])
      );
    }
  });

  activitiesToUpdateIndexes.forEach((index) => {
    updatedActivities[index] = {
      ...gameActivities[index],
      absolute_minute: newStartTime,
    };
  });

  return updatedActivities;
};

export const recalculateCustomPeriodExistingActivities = (
  currentGamePeriods: Array<GamePeriod>,
  customPeriods: Array<GamePeriod>,
  gameActivities: Array<GameActivity>
) => {
  let updatedActivities = [...gameActivities];

  customPeriods.forEach((customPeriod) => {
    const relevantActivitiesToUpdateIndexes = [];
    const activitiesToRemoveIndexes = [];

    const foundExistingPeriod = currentGamePeriods.find(
      (period) => period.id === customPeriod.id
    );

    if (foundExistingPeriod) {
      const oldPeriodStartTime = +foundExistingPeriod.absolute_duration_start;
      const oldPeriodEndTime = +foundExistingPeriod.absolute_duration_end;
      const newPeriodStartTime = +customPeriod.absolute_duration_start;
      const newPeriodEndTime = +customPeriod.absolute_duration_end;

      updatedActivities.forEach((activity, index) => {
        const activityMinute = +activity.absolute_minute;

        if (activityMinute === oldPeriodStartTime)
          relevantActivitiesToUpdateIndexes.push(index);

        // If block handles the retrieval of indexes that will be out of sync of the current period when the time is updated
        // Checks its within the current period time then checks if its out of range of the updated times.
        if (
          !relevantActivitiesToUpdateIndexes.includes(index) &&
          activityMinute >= oldPeriodStartTime &&
          activityMinute < oldPeriodEndTime &&
          (activityMinute < newPeriodStartTime ||
            activityMinute >= newPeriodEndTime)
        ) {
          activitiesToRemoveIndexes.push(index);
        }
      });

      updatedActivities = updateAndRemoveActivitiesFromRecalculation(
        updatedActivities,
        activitiesToRemoveIndexes,
        relevantActivitiesToUpdateIndexes,
        newPeriodStartTime
      );
    }
  });

  return updatedActivities;
};

export const recalculatePeriodEventInfo = (
  localPeriods: Array<GamePeriod>,
  gameActivities: Array<GameActivity>,
  periodDuration: number,
  finalPeriodDuration: number,
  isAddingPeriod?: boolean
): {
  recalculatedActivities: Array<GameActivity>,
  recalculatedPeriods: Object[],
} => {
  let indexCounter = 0;
  let localGameActivities = [...gameActivities];
  const localNonDeletePeriods = localPeriods.filter((period) => !period.delete);

  const updatedPeriods = localPeriods.map((localPeriod) => {
    const relevantActivitiesToUpdateIndexes = [];
    const activitiesToRemoveIndexes = [];
    const periodStartTime = +localPeriod.absolute_duration_start;
    const periodEndTime = +localPeriod.absolute_duration_end;

    const isFinalPeriod = isEqual(
      localNonDeletePeriods[localNonDeletePeriods.length - 1],
      localPeriod
    );

    if (localPeriod.delete) {
      // Filters out any of the activities associated with the period marked for deletion as they will be all deleted
      // by the backend when saved
      if (localPeriod.name !== 'DELETE') {
        localGameActivities = localGameActivities.filter(
          (activity) =>
            +activity.absolute_minute < +localPeriod.absolute_duration_start ||
            +activity.absolute_minute >= +localPeriod.absolute_duration_end
        );
      }
    } else {
      localGameActivities.forEach((activity, index) => {
        const activityMinute = +activity.absolute_minute;

        if (activityMinute === periodStartTime)
          relevantActivitiesToUpdateIndexes.push(index);

        // If block handles the retrieval of indexes that will be out of sync of the current period when the time is updated
        // Checks its within the current period time then checks if its out of range of the updated times.
        if (
          !relevantActivitiesToUpdateIndexes.includes(index) &&
          activityMinute >= periodStartTime &&
          activityMinute < periodEndTime &&
          (activityMinute < periodDuration * indexCounter ||
            activityMinute >= periodDuration * (indexCounter + 1))
        ) {
          activitiesToRemoveIndexes.push(index);
        }
      });

      localGameActivities = updateAndRemoveActivitiesFromRecalculation(
        localGameActivities,
        activitiesToRemoveIndexes,
        relevantActivitiesToUpdateIndexes,
        periodDuration * indexCounter
      );

      indexCounter += 1;
    }

    return isAddingPeriod
      ? {
          ...localPeriod,
          duration: periodDuration,
          absolute_duration_start: periodDuration * (indexCounter - 1),
          absolute_duration_end: periodDuration * indexCounter,
        }
      : {
          ...localPeriod,
          name: localPeriod.delete ? 'DELETE' : `Period ${indexCounter}`,
          duration: isFinalPeriod ? finalPeriodDuration : periodDuration,
          absolute_duration_start: localPeriod.delete
            ? -1
            : periodDuration * (indexCounter - 1),
          absolute_duration_end: periodDuration * indexCounter,
        };
  });

  return {
    recalculatedPeriods: updatedPeriods,
    recalculatedActivities: localGameActivities,
  };
};

export const onAddPeriod = (
  eventPeriods: Array<GamePeriod>,
  gameActivities: Array<GameActivity>,
  duration?: number | null,
  selectedPeriod?: Object,
  setSelectedPeriod?: Function
): {
  recalculatedActivities: Array<GameActivity>,
  recalculatedPeriods: Array<Object>,
} => {
  const localPeriods = [...eventPeriods];
  const {
    newNumOfPeriods,
    newPeriodDuration,
    newPeriodFinalDuration,
    newPeriodFinalTime,
  } = getPeriodDurationInfo(
    getCurrentLocalPeriods(localPeriods),
    true,
    duration
  );
  const lastPeriod = localPeriods[localPeriods.length - 1];

  const { recalculatedPeriods, recalculatedActivities } =
    recalculatePeriodEventInfo(
      localPeriods,
      gameActivities,
      newPeriodDuration,
      newPeriodFinalDuration,
      true
    );

  // Increments the last period Id by 1 (id or local) to use as a localId for unique period comparison before its saved.
  recalculatedPeriods.push({
    localId: (lastPeriod?.localId || lastPeriod?.id || 0) + 1,
    name: `Period ${newNumOfPeriods}`,
    duration: newPeriodFinalDuration,
    absolute_duration_start: newPeriodDuration * (newNumOfPeriods - 1),
    absolute_duration_end: newPeriodFinalTime,
  });

  if (setSelectedPeriod) {
    const foundSelectedPeriodIndex = eventPeriods.findIndex(
      (period) => period === selectedPeriod
    );
    setSelectedPeriod(recalculatedPeriods[foundSelectedPeriodIndex]);
  }

  return {
    recalculatedActivities,
    recalculatedPeriods,
  };
};

export const onDeletePeriod = (
  period: GamePeriod,
  eventPeriods: Array<GamePeriod>,
  gameActivities: Array<GameActivity>,
  duration?: number | null,
  selectedPeriod?: Object,
  setSelectedPeriod?: Function
): {
  recalculatedActivities: Array<GameActivity>,
  recalculatedPeriods: Array<Object>,
} => {
  // Retrieving the full Local periods array, the filtered periods not marked for deletion and the index relative to that filter
  const localPeriods = [...eventPeriods];
  let filteredPeriods = getCurrentLocalPeriods(localPeriods);
  let filteredPeriodIndex = filteredPeriods.findIndex((localPeriod) =>
    isEqual(localPeriod, period)
  );
  // Calculates the new period duration and applies it to each period as well as marks the selected period for deletion
  const { newPeriodDuration, newPeriodFinalDuration } = getPeriodDurationInfo(
    filteredPeriods,
    false,
    duration
  );
  const localPeriodIndex = localPeriods.findIndex((localPeriod) =>
    isEqual(localPeriod, period)
  );
  localPeriods[localPeriodIndex] = {
    ...localPeriods[localPeriodIndex],
    delete: true,
  };

  // Handles the period duration/times recalculation as well as the related activities linked to it
  const { recalculatedPeriods, recalculatedActivities } =
    recalculatePeriodEventInfo(
      localPeriods,
      gameActivities,
      newPeriodDuration,
      newPeriodFinalDuration,
      false
    );

  // Retrieves the new filtered periods not marked for deletion and compares the previous filter index to see if the last
  // period has been deleted and needs to decrease the selected index.
  if (setSelectedPeriod) {
    filteredPeriods = getCurrentLocalPeriods(recalculatedPeriods);
    const isIndexOutOfRange = filteredPeriodIndex > filteredPeriods.length - 1;
    if (isIndexOutOfRange) filteredPeriodIndex -= 1;
    const currentSelectedPeriod = filteredPeriods[filteredPeriodIndex];

    if (isEqual(selectedPeriod, period))
      setSelectedPeriod(currentSelectedPeriod);
    else {
      const foundSelectedPeriodIndex = eventPeriods.findIndex(
        (eventPeriod) => eventPeriod === selectedPeriod
      );
      setSelectedPeriod(recalculatedPeriods[foundSelectedPeriodIndex]);
    }
  }

  return {
    recalculatedActivities,
    recalculatedPeriods: recalculatedPeriods.filter(
      (localPeriod) => !localPeriod.delete || !localPeriod.localId
    ),
  };
};

export const isActivityInPeriod = (
  activity: GameActivity,
  period: GamePeriod,
  isFinalPeriod: boolean
) => {
  if (activity?.game_period_id && period?.id) {
    return activity.game_period_id === period.id;
  }

  const absoluteMinute = +activity.absolute_minute;
  const durationStart = +period.absolute_duration_start;
  const durationEnd = +period.absolute_duration_end;

  let isActivityInEndOfDurationBoundary = absoluteMinute < durationEnd;
  if (isFinalPeriod)
    isActivityInEndOfDurationBoundary = absoluteMinute <= durationEnd;

  return absoluteMinute >= durationStart && isActivityInEndOfDurationBoundary;
};

export const updateAllPeriodGameActivities = ({
  gamePeriods,
  apiGameActivities,
  localGameActivities,
  gameId,
  onlySelectedPeriod,
}: {
  gamePeriods: Array<GamePeriod>,
  apiGameActivities: Array<GameActivity>,
  localGameActivities: Array<GameActivity>,
  gameId: number,
  onlySelectedPeriod?: ?GamePeriod,
}) => {
  return Promise.all(
    gamePeriods.map(async (period) => {
      let savedActivities = [];

      const isFinalPeriod = isEqual(
        period,
        gamePeriods[gamePeriods.length - 1]
      );

      const periodActivities = localGameActivities.filter((activity) =>
        isActivityInPeriod(activity, period, isFinalPeriod)
      );

      // Exits out early if the current period does not match the selected period arg
      if (onlySelectedPeriod && onlySelectedPeriod?.id !== period.id) {
        return periodActivities;
      }

      const apiActivities = apiGameActivities.filter((activity) =>
        isActivityInPeriod(activity, period, isFinalPeriod)
      );

      const activitiesToSave = differenceWith(
        periodActivities,
        apiActivities,
        (activityOne, activityTwo) => isEqual(activityOne, activityTwo)
      );
      const existingActivities = periodActivities.filter(
        (activity) =>
          !activitiesToSave.some((savedActivity) =>
            isEqual(activity, savedActivity)
          )
      );

      if (activitiesToSave.length) {
        savedActivities = await saveAllPeriodGameActivities(
          gameId,
          period.id,
          activitiesToSave
        );
      }

      return [...existingActivities, ...savedActivities];
    })
  );
};

export const sumUpPeriodDurations = (periods: Array<GamePeriod>) =>
  periods.reduce((acc, period) => {
    return acc + period.duration;
  }, 0);

export const updateAllCustomPeriodsNewDurationRanges = (
  customPeriods: Array<GamePeriod>
) => {
  const currentCustomPeriods = [...customPeriods];

  const periodDurationSum = sumUpPeriodDurations(currentCustomPeriods);

  currentCustomPeriods.forEach((_, periodIndex) => {
    let newStartTime = 0;
    let newEndTime = periodDurationSum;
    if (periodIndex > 0) {
      newStartTime =
        +currentCustomPeriods[periodIndex - 1].absolute_duration_end;
    }
    if (periodIndex < currentCustomPeriods.length) {
      newEndTime = newStartTime + currentCustomPeriods[periodIndex].duration;
    }

    currentCustomPeriods[periodIndex] = {
      ...currentCustomPeriods[periodIndex],
      name: `Period ${periodIndex + 1}`,
      absolute_duration_start: newStartTime,
      absolute_duration_end: newEndTime,
    };
  });

  return { periodDurationSum, currentCustomPeriods };
};

export const deleteAndRecalculateCustomPeriods = (
  selectedPeriod: GamePeriod,
  allPeriods: Array<GamePeriod>,
  localGameActivities: Array<GameActivity>
): {
  periodDurationSum: number,
  currentPeriods: Array<GamePeriod>,
  currentActivities: Array<GameActivity>,
} => {
  let periodToDelete = { ...selectedPeriod };
  let currentActivities = [...localGameActivities];
  let currentPeriods = allPeriods.filter(
    (period) => !isEqual(period, periodToDelete)
  );
  if (periodToDelete.id) {
    periodToDelete = {
      ...periodToDelete,
      name: 'DELETE',
      delete: true,
    };
  }
  currentPeriods = getCurrentLocalPeriods(currentPeriods);
  const prevDeletedPeriods = allPeriods.filter((period) => period.delete);
  const { periodDurationSum, currentCustomPeriods } =
    updateAllCustomPeriodsNewDurationRanges(currentPeriods);

  if (periodToDelete.delete) {
    currentPeriods = [
      ...currentCustomPeriods,
      ...prevDeletedPeriods,
      periodToDelete,
    ];
  }

  currentActivities = currentActivities.filter(
    (activity) =>
      +activity.absolute_minute < +periodToDelete.absolute_duration_start ||
      +activity.absolute_minute >= +periodToDelete.absolute_duration_end
  );

  return { periodDurationSum, currentPeriods, currentActivities };
};

export const hasStartingPeriodLineupBeenCompleted = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): boolean => {
  const periodFormation = findFormationForPeriod(gameActivities, currentPeriod);

  const formationRequiredPlayerCount =
    periodFormation?.relation?.number_of_players;

  const allStartingLineupPositionActivities =
    findPeriodPlayerPitchChangeActivities(gameActivities, currentPeriod);

  return (
    formationRequiredPlayerCount === allStartingLineupPositionActivities.length
  );
};

export const hasCaptainBeenAssignedInPeriod = (
  gameActivities: Array<GameActivity>,
  currentPeriod: ?GamePeriod
): boolean => {
  const foundCaptainActivity = getCaptainForTeamActivity(gameActivities);
  const allStartingLineupPositionActivities =
    findPeriodPlayerPitchChangeActivities(gameActivities, currentPeriod);

  return !!allStartingLineupPositionActivities.find(
    (activity) => activity?.athlete_id === foundCaptainActivity?.athlete_id
  );
};

export const getHasPeriodStarted = (
  localGameActivities: Array<GameActivity>,
  selectedPeriod: ?GamePeriod
): boolean =>
  !!findPeriodFormationCompleteActivity(localGameActivities, selectedPeriod);
