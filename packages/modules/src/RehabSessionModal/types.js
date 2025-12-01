// @flow
export type TreatableBodyAreaAttribute = {
  treatable_area_type: string,
  treatable_area_id: ?number,
  side_id: ?number,
};

export type RehabSessionAttribute = {
  rehab_exercise_id: ?number,
  sets: ?number,
  reps: ?number,
  weight: ?number,
  reason: ?string,
  issue_type: ?string,
  issue_id: ?number,
  note: string,
};

export type RehabTemplate = {
  title: string,
  attributes: Array<RehabSessionAttribute>,
};

export type Athlete = {
  id: number,
  fullname: string,
};

type closeRehabSessionModal = {
  type: 'CLOSE_REHAB_SESSION_MODAL',
};

type addRehabAttribute = {
  type: 'ADD_REHAB_ATTRIBUTE',
};

type removeRehabAttribute = {
  type: 'REMOVE_REHAB_ATTRIBUTE',
  payload: {
    index: number,
  },
};

type selectRehabPractitioner = {
  type: 'SELECT_REHAB_PRACTITIONER',
  payload: {
    practitionerId: number,
  },
};

type selectRehabTimezone = {
  type: 'SELECT_REHAB_TIMEZONE',
  payload: {
    timezone: string,
  },
};

type selectRehabExercise = {
  type: 'SELECT_REHAB_EXERCISE',
  payload: {
    exerciseId: number,
    index: number,
  },
};

type updateRehabNoteAttribute = {
  type: 'UPDATE_REHAB_NOTE_ATTRIBUTE',
  payload: {
    text: string,
    index: number,
  },
};

type selectRehabReason = {
  type: 'SELECT_REHAB_REASON',
  payload: {
    reasonObj: Object,
    index: number,
  },
};

type setRehabSets = {
  type: 'SET_REHAB_SETS',
  payload: {
    sets: number,
    index: number,
  },
};

type setRehabReps = {
  type: 'SET_REHAB_REPS',
  payload: {
    reps: number,
    index: number,
  },
};

type updateRehabFiles = {
  type: 'UPDATE_REHAB_FILES',
  payload: {
    files: Array<?File>,
  },
};

type updateRehabNoteText = {
  type: 'UPDATE_REHAB_NOTE_TEXT',
  payload: {
    text: string,
  },
};

type updateRehabNoteRichText = {
  type: 'UPDATE_REHAB_NOTE_RICH_TEXT',
  payload: {
    content: string,
  },
};

type saveRehabSessionLoading = {
  type: 'SAVE_REHAB_SESSION_LOADING',
};

type saveRehabSessionSuccess = {
  type: 'SAVE_REHAB_SESSION_SUCCESS',
};

type saveRehabSessionFailure = {
  type: 'SAVE_REHAB_SESSION_FAILURE',
};

type populateRehabSessionModalLoading = {
  type: 'POPULATE_REHAB_SESSION_MODAL_LOADING',
};

type populateRehabSessionModalFailure = {
  type: 'POPULATE_REHAB_SESSION_MODAL_FAILURE',
};

type addRehabAttributes = {
  type: 'ADD_REHAB_ATTRIBUTES',
  payload: {
    attributes: Array<RehabSessionAttribute>,
  },
};

export type Action =
  | closeRehabSessionModal
  | addRehabAttribute
  | removeRehabAttribute
  | selectRehabPractitioner
  | selectRehabTimezone
  | selectRehabExercise
  | selectRehabReason
  | setRehabSets
  | setRehabReps
  | updateRehabFiles
  | updateRehabNoteText
  | updateRehabNoteRichText
  | saveRehabSessionLoading
  | populateRehabSessionModalLoading
  | saveRehabSessionSuccess
  | saveRehabSessionFailure
  | updateRehabNoteAttribute
  | populateRehabSessionModalFailure
  | addRehabAttributes;
