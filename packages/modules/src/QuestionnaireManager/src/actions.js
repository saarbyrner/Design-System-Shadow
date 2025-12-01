// @flow
import $ from 'jquery';
import type { PlatformType } from '@kitman/common/src/types/__common';
import type { QuestionnaireVariable } from '@kitman/common/src/types';
import {
  formatDataForSaving,
  convertAthletesToIdArray,
  convertQuestionnaireVariablesToIdArray,
  isQuestionnaireEmpty,
} from './utils';
import type { Action, ThunkAction } from '../types/actions';

export const toggleVariable = (
  athleteId: number,
  currentVariableId: string
): Action => ({
  type: 'TOGGLE_VARIABLES',
  payload: {
    athleteId,
    currentVariableId,
  },
});

export const toggleAllVariables = (
  athleteId: number,
  variables: Array<QuestionnaireVariable>
) => ({
  type: 'TOGGLE_ALL_VARIABLES',
  payload: {
    athleteId,
    variables,
  },
});

export const toggleAllAthletes = (
  athleteIds: Array<number>,
  variableId: string
): Action => ({
  type: 'TOGGLE_ALL_ATHLETES',
  payload: {
    athleteIds,
    variableId,
  },
});

export const toggleAthletesPerVariable =
  (variableId: string): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const athleteIds = convertAthletesToIdArray(
      getState().athletes.currentlyVisible
    );
    dispatch(toggleAllAthletes(athleteIds, variableId));
  };

export const setPlatform = (platform: PlatformType): Action => ({
  type: 'SET_PLATFORM',
  payload: {
    platform,
  },
});

export const saveQuestionnaireSuccess = (): Action => ({
  type: 'SAVE_QUESTIONNAIRE_SUCCESS',
});

export const saveQuestionnaireFailure = (): Action => ({
  type: 'SAVE_QUESTIONNAIRE_FAILURE',
});

export const saveQuestionnaireRequest = (): Action => ({
  type: 'SAVE_QUESTIONNAIRE_REQUEST',
});

export const hideCurrentModal = (): Action => ({
  type: 'HIDE_CURRENT_MODAL',
});

export const hideDialogue = (): Action => ({
  type: 'HIDE_DIALOGUE',
});

export const setSquadFilter = (squadId: string): Action => ({
  type: 'SET_SQUAD_FILTER',
  payload: {
    squadId,
  },
});

export const setMassInput = (isMassInput: boolean): Action => ({
  type: 'SET_MASS_INPUT',
  payload: {
    isMassInput,
  },
});

export const setShowWarningMessage = (showWarningMessage: boolean): Action => ({
  type: 'SET_SHOW_WARNING_MESSAGE',
  payload: {
    showWarningMessage,
  },
});

export const showDialogue = (dialogue: string): Action => ({
  type: 'SHOW_DIALOGUE',
  payload: {
    dialogue,
  },
});

export const clearAllVisibleVariables =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const athleteIds = convertAthletesToIdArray(
      getState().athletes.currentlyVisible
    );
    const variableIds = convertQuestionnaireVariablesToIdArray(
      getState().variables.currentlyVisible
    );

    dispatch({
      type: 'CLEAR_ALL_VISIBLE_VARIABLES',
      payload: {
        athleteIds,
        variableIds,
      },
    });

    dispatch(hideDialogue());
  };

export const saveQuestionnaire =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    // if athletes are not valid, dont fire the ajax request, fire error message instead
    if (isQuestionnaireEmpty(getState().checkedVariables)) {
      // dispatch here
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          dialogue: 'empty_warning',
        },
      });
    } else {
      dispatch(saveQuestionnaireRequest());
      // format checked variables from hash to array for saving on the backend
      const formattedData = formatDataForSaving(getState().checkedVariables);
      const data: {
        variables: Object,
        mass_input: boolean,
        show_warning_message: boolean,
      } = {
        variables: formattedData,
        mass_input: getState().templateData.mass_input,
        show_warning_message: getState().templateData.show_warning_message,
      };

      $.ajax({
        method: 'PUT',
        url: window.location.pathname,
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        data: JSON.stringify(data),
      })
        .done(() => {
          dispatch(saveQuestionnaireSuccess());
          setTimeout(() => {
            dispatch(hideCurrentModal());
          }, 1000);
        })
        .fail(() => {
          dispatch(saveQuestionnaireFailure());
        });
    }
  };
