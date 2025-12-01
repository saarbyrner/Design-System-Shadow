// @flow
/* eslint-disable no-use-before-define */

import type { Store } from './store';
import type { ParticipationLevel } from '../../types';

type updateDuration = {
  type: 'UPDATE_DURATION',
  payload: {
    athleteId: number,
    duration: string,
  },
};

type updateParticipationLevel = {
  type: 'UPDATE_PARTICIPATION_LEVEL',
  payload: {
    athleteId: number,
    participationLevel: ParticipationLevel,
    eventDuration: string,
    isAthletePrimarySquadSelected: boolean,
  },
};

type updateRPE = {
  type: 'UPDATE_RPE',
  payload: {
    athleteId: number,
    rpe: string,
  },
};

type toggleIncludeInGroupCalculations = {
  type: 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS',
  payload: {
    athleteId: number,
  },
};

type updateRpeCollectionAthlete = {
  type: 'UPDATE_RPE_COLLECTION_ATHLETE',
  payload: {
    rpeCollectionAthlete: boolean,
  },
};

type updateRpeCollectionKiosk = {
  type: 'UPDATE_RPE_COLLECTION_KIOSK',
  payload: {
    rpeCollectionKiosk: boolean,
  },
};

type updateMassInput = {
  type: 'UPDATE_MASS_INPUT',
  payload: {
    massInput: boolean,
  },
};

type updateAllDurations = {
  type: 'UPDATE_ALL_DURATIONS',
  payload: {
    filteredAthletes: Array<number>,
    duration: string,
    participationLevels: Array<ParticipationLevel>,
  },
};

type updateAllParticipationLevels = {
  type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
  payload: {
    filteredAthletes: Array<number>,
    participationLevel: ParticipationLevel,
    eventDuration: string,
    selectedSquadId: number,
  },
};

type toggleAllIncludeInGroupCalculations = {
  type: 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION',
  payload: {
    filteredAthletes: Array<number>,
    includeInGroupCalculations: boolean,
    participationLevels: Array<ParticipationLevel>,
  },
};

type saveParticipationFormLoading = {
  type: 'SAVE_PARTICIPATION_FORM_LOADING',
};

type saveParticipationFormFailure = {
  type: 'SAVE_PARTICIPATION_FORM_FAILURE',
};

type saveParticipationFormSuccess = {
  type: 'SAVE_PARTICIPATION_FORM_SUCCESS',
};

type showCancelConfirm = {
  type: 'SHOW_CANCEL_CONFIRM',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

export type Action =
  | updateDuration
  | updateParticipationLevel
  | updateRPE
  | toggleIncludeInGroupCalculations
  | updateRpeCollectionAthlete
  | updateRpeCollectionKiosk
  | updateMassInput
  | updateAllDurations
  | updateAllParticipationLevels
  | toggleAllIncludeInGroupCalculations
  | saveParticipationFormLoading
  | saveParticipationFormFailure
  | saveParticipationFormSuccess
  | showCancelConfirm
  | hideAppStatus;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
