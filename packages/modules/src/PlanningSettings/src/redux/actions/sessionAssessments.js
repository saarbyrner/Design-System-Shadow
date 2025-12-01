// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';
import type { SessionAssessment } from '../../../types';

export const clearEditedSessionAssessments = (): Action => ({
  type: 'CLEAR_EDITED_SESSION_ASSESSMENTS',
});

export const selectAssessmentType = (
  sessionTypeId: number,
  selectedAssessmentTypeArray: Array<number>
): Action => ({
  type: 'SELECT_ASSESSMENT_TYPE',
  payload: {
    sessionTypeId,
    selectedAssessmentTypeArray,
  },
});

export const sessionAssessmentRequestPending = (): Action => ({
  type: 'SESSION_ASSESSMENT_REQUEST_PENDING',
});

export const sessionAssessmentRequestFailure = (): Action => ({
  type: 'SESSION_ASSESSMENT_REQUEST_FAILURE',
});

export const sessionAssessmentRequestSuccess = (): Action => ({
  type: 'SESSION_ASSESSMENT_REQUEST_SUCCESS',
});

export const setSessionTemplates = (
  data: Array<SessionAssessment>
): Action => ({
  type: 'SET_SESSION_TEMPLATES',
  payload: {
    data,
  },
});

/* ------------ THUNK ACTIONS ------------ */

export const getSessionTemplates =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (getState().sessionAssessments.requestStatus !== 'LOADING') {
      dispatch(sessionAssessmentRequestPending());
    }

    $.ajax({
      method: 'GET',
      url: `/planning_hub/settings/fetch_settings`,
      contentType: 'application/json',
    })
      .done((data) => {
        dispatch(setSessionTemplates(data));
        dispatch(sessionAssessmentRequestSuccess());
      })
      .fail(() => {
        dispatch(sessionAssessmentRequestFailure());
      });
  };

export const saveSelectedAssessmentTypes =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(sessionAssessmentRequestPending());
    const editedSessionAssessments =
      getState().sessionAssessments.editedSessionAssessments;
    const data = [];
    Object.keys(editedSessionAssessments).forEach((key) => {
      data.push({
        organisations_session_type: parseInt(key, 10),
        assessment_templates: editedSessionAssessments[key],
      });
    });

    $.ajax({
      method: 'POST',
      url: `/planning_hub/settings/bulk_update`,
      contentType: 'application/json',
      data: JSON.stringify({ bulk_info: data }),
    })
      .done(() => {
        dispatch(getSessionTemplates());
        dispatch(clearEditedSessionAssessments());
      })
      .fail(() => {
        dispatch(sessionAssessmentRequestFailure());
      });
  };
