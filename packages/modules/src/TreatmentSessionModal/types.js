// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export type TreatableBodyAreaAttribute = {
  treatable_area_type: string,
  treatable_area_id: ?number,
  side_id: ?number,
};

export type TreatmentAttribute = {
  treatment_modality_id: ?number,
  duration: ?number,
  reason: ?string,
  issue_type: ?string,
  issue_id: ?number,
  treatment_body_areas_attributes: Array<?TreatableBodyAreaAttribute>,
  note: string,
};

export type treatableAreOptionResponse = {
  description: string,
  isGroupOption: boolean,
  name: string,
  value: {
    side_id: number,
    treatable_area_id: number,
    treatable_area_type: string,
  },
};

export type Athlete = {
  id: number,
  fullname: string,
};

export type TreatmentTemplate = {
  title: string,
  attributes: Array<TreatmentAttribute>,
};

type closeTreatmentSessionModal = {
  type: 'CLOSE_TREATMENT_SESSION_MODAL',
};

type addTreatmentAttribute = {
  type: 'ADD_TREATMENT_ATTRIBUTE',
};

type removeTreatmentAttribute = {
  type: 'REMOVE_TREATMENT_ATTRIBUTE',
  payload: {
    index: number,
  },
};

type selectBodyArea = {
  type: 'SELECT_BODY_AREA',
  payload: {
    bodyArea: string,
    bodyAreaParent: string,
    index: number,
  },
};

type selectPractitioner = {
  type: 'SELECT_PRACTITIONER',
  payload: {
    practitionerId: number,
  },
};

type selectTimezone = {
  type: 'SELECT_TIMEZONE',
  payload: {
    timezone: string,
  },
};

type selectTreatmentModality = {
  type: 'SELECT_TREATMENT_MODALITY',
  payload: {
    modalityId: number,
    index: number,
  },
};

type selectTreatmentReason = {
  type: 'SELECT_TREATMENT_REASON',
  payload: {
    reasonObj: Object,
    index: number,
  },
};

type setTreatmentDuration = {
  type: 'SET_TREATMENT_DURATION',
  payload: {
    duration: number,
    index: number,
  },
};

type updateTreatmentNoteAttribute = {
  type: 'UPDATE_TREATMENT_NOTE_ATTRIBUTE',
  payload: {
    text: string,
    index: number,
  },
};

type unselectBodyArea = {
  type: 'UNSELECT_BODY_AREA',
  payload: {
    bodyArea: string,
    index: number,
  },
};

type unselectParentBodyArea = {
  type: 'UNSELECT_PARENT_BODY_AREA',
  payload: {
    bodyAreas: Array<string>,
    index: number,
  },
};

type updateFiles = {
  type: 'UPDATE_TREATMENT_FILES',
  payload: {
    files: Array<AttachedFile>,
  },
};

type updateTreatmentNoteText = {
  type: 'UPDATE_TREATMENT_NOTE_TEXT',
  payload: {
    text: string,
  },
};

type updateTreatmentNoteRichText = {
  type: 'UPDATE_TREATMENT_NOTE_RICH_TEXT',
  payload: {
    content: string,
  },
};

type saveTreatmentSessionLoading = {
  type: 'SAVE_TREATMENT_SESSION_LOADING',
};

type saveTreatmentSessionSuccess = {
  type: 'SAVE_TREATMENT_SESSION_SUCCESS',
};

type saveTreatmentSessionFailure = {
  type: 'SAVE_TREATMENT_SESSION_FAILURE',
};

type populateTreatmentSessionModalLoading = {
  type: 'POPULATE_TREATMENT_SESSION_MODAL_LOADING',
};

type populateTreatmentSessionModalFailure = {
  type: 'POPULATE_TREATMENT_SESSION_MODAL_FAILURE',
};

type addTreatmentAttributes = {
  type: 'ADD_TREATMENT_ATTRIBUTES',
  payload: {
    attributes: Array<TreatmentAttribute>,
  },
};

export type Action =
  | closeTreatmentSessionModal
  | addTreatmentAttribute
  | removeTreatmentAttribute
  | selectBodyArea
  | selectPractitioner
  | selectTimezone
  | selectTreatmentModality
  | selectTreatmentReason
  | setTreatmentDuration
  | unselectBodyArea
  | unselectParentBodyArea
  | updateFiles
  | saveTreatmentSessionLoading
  | saveTreatmentSessionSuccess
  | populateTreatmentSessionModalLoading
  | saveTreatmentSessionFailure
  | populateTreatmentSessionModalFailure
  | updateTreatmentNoteAttribute
  | updateTreatmentNoteRichText
  | updateTreatmentNoteText
  | addTreatmentAttributes;
