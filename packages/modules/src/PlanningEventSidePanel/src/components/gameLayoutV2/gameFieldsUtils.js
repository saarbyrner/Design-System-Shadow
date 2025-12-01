// @flow

import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import { sumUpPeriodDurations } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';

export const LOCAL_CUSTOM_OPPOSITION_OPTION_ID = -1;
export const MAX_CUSTOM_PERIOD_LIMIT = 15;

export const generateCustomPeriodsAndSplitTimes = (
  duration: number,
  numberOfPeriods: number,
  customPeriods: Array<GamePeriod>,
  updateEventDetails: Function
) => {
  if (numberOfPeriods) {
    const newSplitValue = Math.floor(duration / numberOfPeriods);
    if (newSplitValue && numberOfPeriods) {
      const allPeriodsExceptLast = numberOfPeriods - 1;
      const newPeriodsDurationSum = allPeriodsExceptLast * newSplitValue;
      const newPeriodFinalDuration = duration - newPeriodsDurationSum;

      let currentCustomPeriodsUpdated;

      if (customPeriods.length)
        currentCustomPeriodsUpdated = customPeriods.map((period, index) => ({
          ...period,
          duration:
            index === numberOfPeriods - 1
              ? newPeriodFinalDuration
              : newSplitValue,
          absolute_duration_start: newSplitValue * index,
          absolute_duration_end:
            index === numberOfPeriods - 1
              ? duration
              : newSplitValue * (index + 1),
        }));
      else
        currentCustomPeriodsUpdated = [
          ...Array(allPeriodsExceptLast)
            .fill()
            .map((_, index) => ({
              name: `Period ${index + 1}`,
              duration: newSplitValue,
              absolute_duration_start: newSplitValue * index,
              absolute_duration_end: newSplitValue * (index + 1),
            })),
          {
            name: `Period ${numberOfPeriods}`,
            duration: newPeriodFinalDuration,
            absolute_duration_start: newSplitValue * allPeriodsExceptLast,
            absolute_duration_end: +duration,
          },
        ];

      updateEventDetails({
        custom_periods: currentCustomPeriodsUpdated,
      });
    }
  }
};

export const removeCustomPeriods = (
  customPeriodMode: boolean,
  newNumOfPeriods: number,
  eventCustomPeriods: Array<GamePeriod>,
  updateEventDetails: Function
) => {
  const customPeriods = [...eventCustomPeriods];
  let currentCustomPeriods = customPeriods
    .filter((period) => !period.delete)
    .filter((period, index) => index < newNumOfPeriods || period.id);
  currentCustomPeriods = currentCustomPeriods.map((period, index) => ({
    ...period,
    delete: period.delete || index >= newNumOfPeriods,
  }));
  const previouslySavedPeriods = currentCustomPeriods.filter(
    (period) => period.id
  );
  const newPeriods = currentCustomPeriods.filter((period) => !period.id);
  const previouslySavedPeriodsToDelete = eventCustomPeriods.filter(
    (period) => period.delete
  );

  currentCustomPeriods = [
    ...previouslySavedPeriods,
    ...previouslySavedPeriodsToDelete,
    ...newPeriods,
  ];

  if (currentCustomPeriods.length && customPeriodMode) {
    const periodDurationSum = currentCustomPeriods.reduce((acc, period) => {
      const currentDuration = period.delete ? 0 : period.duration;
      return acc + currentDuration;
    }, 0);

    if (periodDurationSum) {
      updateEventDetails({ duration: periodDurationSum });
    }
  }
  updateEventDetails({
    custom_periods: currentCustomPeriods,
  });
};

export const addCustomPeriods = (
  customPeriodMode: boolean,
  newNumOfPeriods: number,
  oldNumOfPeriods: number,
  eventDuration: number,
  eventCustomPeriods: Array<GamePeriod>,
  updateEventDetails: Function
) => {
  const customPeriods = [...eventCustomPeriods];
  let positiveNewPeriodDifference = newNumOfPeriods - oldNumOfPeriods;
  const foundPeriodsIndexesSetToDelete = [];

  customPeriods.forEach((period, index) => {
    if (period.id && period.delete && positiveNewPeriodDifference > 0) {
      foundPeriodsIndexesSetToDelete.push(index);
      positiveNewPeriodDifference -= 1;
    }
  });

  if (foundPeriodsIndexesSetToDelete.length) {
    foundPeriodsIndexesSetToDelete.forEach((index) => {
      customPeriods[index] = { ...customPeriods[index], delete: false };
    });
  }

  const currentCustomPeriods = customPeriods.filter((period) => !period.delete);
  const periodDurationSum = sumUpPeriodDurations(currentCustomPeriods);

  let newUnsavedPeriods = [];
  if (positiveNewPeriodDifference > 0)
    newUnsavedPeriods = Array(positiveNewPeriodDifference)
      .fill()
      .map((_, index) => ({
        name: `Period ${currentCustomPeriods.length + (index + 1)}`,
        duration: !customPeriodMode ? customPeriods[0].duration : 0,
        absolute_duration_start: eventDuration,
        absolute_duration_end: eventDuration,
      }));

  updateEventDetails({
    custom_periods: [...customPeriods, ...newUnsavedPeriods],
    ...(periodDurationSum && customPeriodMode
      ? { duration: periodDurationSum }
      : {}),
  });
};
