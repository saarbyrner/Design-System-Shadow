// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Action, TreatmentAttribute } from './types';

export const closeTreatmentSessionModal = (): Action => ({
  type: 'CLOSE_TREATMENT_SESSION_MODAL',
});

export const addTreatmentAttribute = (): Action => ({
  type: 'ADD_TREATMENT_ATTRIBUTE',
});

export const removeTreatmentAttribute = (index: number): Action => ({
  type: 'REMOVE_TREATMENT_ATTRIBUTE',
  payload: {
    index,
  },
});

export const addTreatmentAttributes = (
  attributes: Array<TreatmentAttribute>
): Action => ({
  type: 'ADD_TREATMENT_ATTRIBUTES',
  payload: {
    attributes,
  },
});

export const selectBodyArea = (
  bodyAreaId: string,
  bodyPartParentId: string,
  index: number
): Action => ({
  type: 'SELECT_BODY_AREA',
  payload: {
    bodyArea: JSON.parse(bodyAreaId),
    bodyAreaParent: JSON.parse(bodyPartParentId),
    index,
  },
});

export const selectPractitioner = (practitionerId: number): Action => ({
  type: 'SELECT_PRACTITIONER',
  payload: {
    practitionerId,
  },
});

export const selectTimezone = (timezone: string): Action => ({
  type: 'SELECT_TIMEZONE',
  payload: {
    timezone,
  },
});

export const selectTreatmentModality = (
  modalityId: number,
  index: number
): Action => ({
  type: 'SELECT_TREATMENT_MODALITY',
  payload: {
    modalityId,
    index,
  },
});

export const selectTreatmentReason = (
  reasonObj: Object,
  index: number
): Action => ({
  type: 'SELECT_TREATMENT_REASON',
  payload: {
    reasonObj,
    index,
  },
});

export const setTreatmentDuration = (
  duration: number,
  index: number
): Action => ({
  type: 'SET_TREATMENT_DURATION',
  payload: {
    duration,
    index,
  },
});

export const unselectBodyArea = (
  bodyAreaId: string,
  index: number
): Action => ({
  type: 'UNSELECT_BODY_AREA',
  payload: {
    bodyArea: bodyAreaId,
    index,
  },
});

export const unselectParentBodyArea = (
  bodyAreaIdArray: Array<string>,
  index: number
): Action => ({
  type: 'UNSELECT_PARENT_BODY_AREA',
  payload: {
    bodyAreas: bodyAreaIdArray,
    index,
  },
});

export const updateFiles = (files: Array<AttachedFile>): Action => ({
  type: 'UPDATE_TREATMENT_FILES',
  payload: {
    files,
  },
});

export const updateTreatmentNoteAttribute = (
  text: string,
  index: number
): Action => ({
  type: 'UPDATE_TREATMENT_NOTE_ATTRIBUTE',
  payload: {
    text,
    index,
  },
});

export const updateTreatmentNoteText = (text: string): Action => ({
  type: 'UPDATE_TREATMENT_NOTE_TEXT',
  payload: {
    text,
  },
});

export const updateTreatmentNoteRichText = (content: string): Action => ({
  type: 'UPDATE_TREATMENT_NOTE_RICH_TEXT',
  payload: {
    content,
  },
});

export const saveTreatmentSessionLoading = (): Action => ({
  type: 'SAVE_TREATMENT_SESSION_LOADING',
});

export const populateTreatmentSessionModalLoading = (): Action => ({
  type: 'POPULATE_TREATMENT_SESSION_MODAL_LOADING',
});

export const saveTreatmentSessionSuccess = (): Action => ({
  type: 'SAVE_TREATMENT_SESSION_SUCCESS',
});

export const saveTreatmentSessionFailure = (): Action => ({
  type: 'SAVE_TREATMENT_SESSION_FAILURE',
});

export const populateTreatmentSessionModalFailure = (): Action => ({
  type: 'POPULATE_TREATMENT_SESSION_MODAL_FAILURE',
});
