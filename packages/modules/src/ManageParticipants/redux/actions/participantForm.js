// @flow

import type { Action } from '../types/actions';
import type { ParticipationLevel } from '../../types';

export const updateDuration = (
  athleteId: number,
  duration: string
): Action => ({
  type: 'UPDATE_DURATION',
  payload: {
    athleteId,
    duration,
  },
});

export const updateParticipationLevel = (
  athleteId: number,
  participationLevel: ParticipationLevel,
  eventDuration: string,
  isAthletePrimarySquadSelected: boolean
): Action => ({
  type: 'UPDATE_PARTICIPATION_LEVEL',
  payload: {
    athleteId,
    participationLevel,
    eventDuration,
    isAthletePrimarySquadSelected,
  },
});

export const updateRPE = (athleteId: number, rpe: string): Action => ({
  type: 'UPDATE_RPE',
  payload: {
    athleteId,
    rpe,
  },
});

export const toggleIncludeInGroupCalculations = (
  athleteId: number
): Action => ({
  type: 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS',
  payload: {
    athleteId,
  },
});

export const updateRpeCollectionAthlete = (
  rpeCollectionAthlete: boolean
): Action => ({
  type: 'UPDATE_RPE_COLLECTION_ATHLETE',
  payload: {
    rpeCollectionAthlete,
  },
});

export const updateRpeCollectionKiosk = (
  rpeCollectionKiosk: boolean
): Action => ({
  type: 'UPDATE_RPE_COLLECTION_KIOSK',
  payload: {
    rpeCollectionKiosk,
  },
});

export const updateMassInput = (massInput: boolean): Action => ({
  type: 'UPDATE_MASS_INPUT',
  payload: {
    massInput,
  },
});

export const updateAllDurations = (
  filteredAthletes: Array<number>,
  duration: string,
  participationLevels: Array<ParticipationLevel>
): Action => ({
  type: 'UPDATE_ALL_DURATIONS',
  payload: {
    filteredAthletes,
    duration,
    participationLevels,
  },
});

export const updateAllParticipationLevels = (
  filteredAthletes: Array<number>,
  participationLevel: ParticipationLevel,
  eventDuration: string,
  selectedSquadId: number
): Action => ({
  type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
  payload: {
    filteredAthletes,
    participationLevel,
    eventDuration,
    selectedSquadId,
  },
});

export const toggleAllIncludeInGroupCalculations = (
  filteredAthletes: Array<number>,
  includeInGroupCalculations: boolean,
  participationLevels: Array<ParticipationLevel>
): Action => ({
  type: 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION',
  payload: {
    filteredAthletes,
    includeInGroupCalculations,
    participationLevels,
  },
});
