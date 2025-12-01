// @flow
/* eslint-disable no-use-before-define */
import type { Store } from './store';
import type { SessionAssessment } from '../../../types';

/* ------------ app ACTIONS ------------ */
type requestFailure = {
  type: 'REQUEST_FAILURE',
};
type requestPending = {
  type: 'REQUEST_PENDING',
};
type requestSuccess = {
  type: 'REQUEST_SUCCESS',
};
type setAssessmentTemplates = {
  type: 'SET_ASSESSMENT_TEMPLATES',
  payload: {
    assessmentTemplates: Array<number>,
  },
};

/* ------------ sessionAssessment ACTIONS ----------*/
type clearEditedSessionAssessments = {
  type: 'CLEAR_EDITED_SESSION_ASSESSMENTS',
};
type selectAssessmentType = {
  type: 'SELECT_ASSESSMENT_TYPE',
  payload: {
    sessionTypeId: number,
    selectedAssessmentTypeArray: Array<number>,
  },
};
type sessionAssessmentRequestFailure = {
  type: 'SESSION_ASSESSMENT_REQUEST_FAILURE',
};
type sessionAssessmentRequestPending = {
  type: 'SESSION_ASSESSMENT_REQUEST_PENDING',
};
type sessionAssessmentRequestSuccess = {
  type: 'SESSION_ASSESSMENT_REQUEST_SUCCESS',
};
type setSessionTemplates = {
  type: 'SET_SESSION_TEMPLATES',
  payload: {
    data: Array<SessionAssessment>,
  },
};

/* ------------ gameAssessment ACTIONS ----------*/
type clearEditedGameTemplates = {
  type: 'CLEAR_EDITED_GAME_TEMPLATES',
};
type selectGameAssessmentType = {
  type: 'SELECT_GAME_ASSESSMENT_TYPE',
  payload: {
    selectedAssessmentTypeArray: Array<number>,
  },
};
type gameRequestFailure = {
  type: 'GAME_REQUEST_FAILURE',
};
type gameRequestPending = {
  type: 'GAME_REQUEST_PENDING',
};
type gameRequestSuccess = {
  type: 'GAME_REQUEST_SUCCESS',
};
type setGameTemplates = {
  type: 'SET_GAME_TEMPLATES',
  payload: {
    assessmentTemplates: Array<number>,
  },
};

export type Action =
  | requestFailure
  | requestPending
  | requestSuccess
  | setAssessmentTemplates
  | clearEditedSessionAssessments
  | selectAssessmentType
  | sessionAssessmentRequestFailure
  | sessionAssessmentRequestPending
  | sessionAssessmentRequestSuccess
  | setSessionTemplates
  | clearEditedGameTemplates
  | selectGameAssessmentType
  | gameRequestFailure
  | gameRequestPending
  | gameRequestSuccess
  | setGameTemplates;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
