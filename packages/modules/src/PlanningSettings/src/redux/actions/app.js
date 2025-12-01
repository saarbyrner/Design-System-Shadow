// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';

export const requestPending = (): Action => ({
  type: 'REQUEST_PENDING',
});

export const requestFailure = (): Action => ({
  type: 'REQUEST_FAILURE',
});

export const requestSuccess = (): Action => ({
  type: 'REQUEST_SUCCESS',
});

export const setAssessmentTemplates = (
  assessmentTemplates: Array<number>
): Action => ({
  type: 'SET_ASSESSMENT_TEMPLATES',
  payload: {
    assessmentTemplates,
  },
});

/* ------------ THUNK ACTIONS ------------ */

export const getAssessmentTemplates =
  (): ThunkAction => (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());
    $.ajax({
      method: 'GET',
      url: `/assessment_templates`,
      contentType: 'application/json',
    })
      .done((data) => {
        dispatch(setAssessmentTemplates(data.assessment_templates));
        dispatch(requestSuccess());
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
