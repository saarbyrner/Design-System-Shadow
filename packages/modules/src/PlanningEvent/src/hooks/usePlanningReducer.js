// @flow
import { useReducer } from 'react';

import { type Dispatch } from '@kitman/common/src/types';
import { type Row } from '@kitman/modules/src/PlanningEvent/src/components/AthletesSelectionTab';
import { type EventsUser } from '@kitman/common/src/types/Event';

export type PlanningEventState = {
  athleteEvents: Array<Row>,
  staff: Array<{
    ...EventsUser,
    activities?: Array<{
      id: number,
      value: boolean,
    }>,
    order: number,
  }>,
};

const INITIAL_STATE: PlanningEventState = {
  athleteEvents: [],
  staff: [],
};

export type PlanningAction =
  | {
      type: 'SET_ATHLETE_EVENTS',
      athletes: Array<Row>,
    }
  | {
      type: 'SET_ATHLETES_PARTICIPATION',
      includeInGroupCalc: boolean,
      athleteId: number,
      newRow: Row,
      newActivityIds: Array<number>,
    }
  | {
      type: 'SET_STAFF_PARTICIPATION',
      staff: $PropertyType<PlanningEventState, 'staff'>,
    }
  | { type: 'REMOVE_DRILL', drillId: number }
  | { type: 'ADD_DRILL', drillId: number };

export type PlanningDispatch = Dispatch<PlanningAction>;

const planningReducer = (
  state: PlanningEventState,
  action: PlanningAction
): PlanningEventState => {
  switch (action.type) {
    case 'SET_ATHLETE_EVENTS': {
      return {
        ...state,
        athleteEvents: [...action.athletes],
      };
    }

    case 'SET_ATHLETES_PARTICIPATION': {
      const newAthleteEvents = state.athleteEvents.slice();
      const updateAthleteIndex = newAthleteEvents.findIndex(
        ({ athlete }) => athlete.id === action.athleteId
      );
      newAthleteEvents[updateAthleteIndex] = {
        ...action.newRow,
        event_activity_ids: action.newActivityIds,
        include_in_group_calculations: action.includeInGroupCalc,
      };
      return {
        ...state,
        athleteEvents: newAthleteEvents,
      };
    }

    case 'SET_STAFF_PARTICIPATION': {
      return {
        ...state,
        staff: [...state.staff, ...action.staff],
      };
    }

    case 'REMOVE_DRILL': {
      return {
        ...state,
        athleteEvents: state.athleteEvents.slice().map((event) => {
          const deletedIdIndex = event.event_activity_ids?.findIndex(
            (id) => id === action.drillId
          );

          if (deletedIdIndex && deletedIdIndex !== -1) {
            event.event_activity_ids?.splice(deletedIdIndex, 1);
          }

          return event;
        }),
      };
    }

    case 'ADD_DRILL': {
      return {
        ...state,
        athleteEvents: state.athleteEvents.slice().map((event) => {
          event.event_activity_ids?.push(action.drillId);
          return event;
        }),
      };
    }

    default:
      throw new Error(
        `PlanningEvent: usePlanningReducer: unknown action type: ${action.type}`
      );
  }
};

const usePlanningReducer = (): [PlanningEventState, PlanningDispatch] =>
  useReducer(planningReducer, INITIAL_STATE);

export default usePlanningReducer;
