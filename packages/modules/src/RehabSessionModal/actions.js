// @flow
import type { RehabSessionAttribute, Action } from './types';

export const closeRehabSessionModal = (): Action => ({
  type: 'CLOSE_REHAB_SESSION_MODAL',
});

export const addRehabAttribute = (): Action => ({
  type: 'ADD_REHAB_ATTRIBUTE',
});

export const removeRehabAttribute = (index: number): Action => ({
  type: 'REMOVE_REHAB_ATTRIBUTE',
  payload: {
    index,
  },
});

export const selectRehabPractitioner = (practitionerId: number): Action => ({
  type: 'SELECT_REHAB_PRACTITIONER',
  payload: {
    practitionerId,
  },
});

export const selectRehabTimezone = (timezone: string): Action => ({
  type: 'SELECT_REHAB_TIMEZONE',
  payload: {
    timezone,
  },
});

export const selectRehabExercise = (
  exerciseId: number,
  index: number
): Action => ({
  type: 'SELECT_REHAB_EXERCISE',
  payload: {
    exerciseId,
    index,
  },
});

export const selectRehabReason = (
  reasonObj: Object,
  index: number
): Action => ({
  type: 'SELECT_REHAB_REASON',
  payload: {
    reasonObj,
    index,
  },
});

export const setRehabSets = (sets: number, index: number): Action => ({
  type: 'SET_REHAB_SETS',
  payload: {
    sets,
    index,
  },
});

export const setRehabReps = (reps: number, index: number): Action => ({
  type: 'SET_REHAB_REPS',
  payload: {
    reps,
    index,
  },
});

export const updateRehabFiles = (files: Array<?File>): Action => ({
  type: 'UPDATE_REHAB_FILES',
  payload: {
    files,
  },
});

export const updateRehabNoteText = (text: string): Action => ({
  type: 'UPDATE_REHAB_NOTE_TEXT',
  payload: {
    text,
  },
});

export const updateRehabNoteAttribute = (
  text: string,
  index: number
): Action => ({
  type: 'UPDATE_REHAB_NOTE_ATTRIBUTE',
  payload: {
    text,
    index,
  },
});

export const updateRehabNoteRichText = (content: string): Action => ({
  type: 'UPDATE_REHAB_NOTE_RICH_TEXT',
  payload: {
    content,
  },
});

export const saveRehabSessionLoading = (): Action => ({
  type: 'SAVE_REHAB_SESSION_LOADING',
});

export const populateRehabSessionModalLoading = (): Action => ({
  type: 'POPULATE_REHAB_SESSION_MODAL_LOADING',
});

export const saveRehabSessionSuccess = (): Action => ({
  type: 'SAVE_REHAB_SESSION_SUCCESS',
});

export const saveRehabSessionFailure = (): Action => ({
  type: 'SAVE_REHAB_SESSION_FAILURE',
});

export const populateRehabSessionModalFailure = (): Action => ({
  type: 'POPULATE_REHAB_SESSION_MODAL_FAILURE',
});

export const addRehabAttributes = (
  attributes: Array<RehabSessionAttribute>
): Action => ({
  type: 'ADD_REHAB_ATTRIBUTES',
  payload: {
    attributes,
  },
});
