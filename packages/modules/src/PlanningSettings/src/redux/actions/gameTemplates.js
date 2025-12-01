// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';

export const clearEditedGameTemplates = (): Action => ({
  type: 'CLEAR_EDITED_GAME_TEMPLATES',
});

export const selectAssessmentType = (
  selectedAssessmentTypeArray: Array<number>
): Action => ({
  type: 'SELECT_GAME_ASSESSMENT_TYPE',
  payload: {
    selectedAssessmentTypeArray,
  },
});

export const gameRequestPending = (): Action => ({
  type: 'GAME_REQUEST_PENDING',
});

export const gameRequestFailure = (): Action => ({
  type: 'GAME_REQUEST_FAILURE',
});

export const gameRequestSuccess = (): Action => ({
  type: 'GAME_REQUEST_SUCCESS',
});

export const setGameTemplates = (
  assessmentTemplates: Array<number>
): Action => ({
  type: 'SET_GAME_TEMPLATES',
  payload: {
    assessmentTemplates,
  },
});

/* ------------ THUNK ACTIONS ------------ */

export const getGameTemplates =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (getState().gameTemplates.requestStatus !== 'LOADING') {
      dispatch(gameRequestPending());
    }

    $.ajax({
      method: 'GET',
      url: `/ui/game_assessment_templates`,
    })
      .done((data) => {
        dispatch(setGameTemplates(data.assessment_template_ids));
        dispatch(gameRequestSuccess());
      })
      .fail(() => {
        dispatch(gameRequestFailure());
      });
  };

export const saveGameSelectedAssessmentTypes =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(gameRequestPending());
    const editedGameTemplates = getState().gameTemplates.editedGameTemplates;

    $.ajax({
      method: 'POST',
      url: `/ui/game_assessment_templates/bulk_save`,
      contentType: 'application/json',
      data: JSON.stringify({ assessment_template_ids: editedGameTemplates }),
    })
      .done(() => {
        dispatch(getGameTemplates());
        dispatch(clearEditedGameTemplates());
      })
      .fail(() => {
        dispatch(gameRequestFailure());
      });
  };
