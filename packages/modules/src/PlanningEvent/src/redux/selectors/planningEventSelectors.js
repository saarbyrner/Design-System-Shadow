// @flow
import { createSelector } from '@reduxjs/toolkit';
import type { Store } from '@kitman/modules/src/PlanningEvent/src/redux/types/store';
import type { Event } from '@kitman/common/src/types/Event';

export const getPlanningEvent = (state: { planningEvent: Store }) => {
  return state.planningEvent;
};

export const getGameEvent = (): Event =>
  createSelector([getPlanningEvent], (planningEvent) => {
    return planningEvent?.gameEvent?.event;
  });

export const getMatchDayView = (): string =>
  createSelector([getPlanningEvent], (planningEvent) => {
    return planningEvent?.gameEvent?.matchDayView;
  });
