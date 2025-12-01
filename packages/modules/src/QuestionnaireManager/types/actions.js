// @flow
/* eslint-disable no-use-before-define */

import type { PlatformType } from '@kitman/common/src/types/__common';
import type {
  QuestionnaireVariable,
  HideDialogueAction,
  ShowDialogueAction,
} from '@kitman/common/src/types';
import type { State } from './state';

type ToggleVariableAction = {
  type: 'TOGGLE_VARIABLES',
  payload: { athleteId: number, currentVariableId: string },
};
type ToggleAllVariablesAction = {
  type: 'TOGGLE_ALL_VARIABLES',
  payload: { athleteId: number, variables: Array<QuestionnaireVariable> },
};
type ToggleAllAthletesAction = {
  type: 'TOGGLE_ALL_ATHLETES',
  payload: { athleteIds: Array<number>, variableId: string },
};
type SetPlatformAction = {
  type: 'SET_PLATFORM',
  payload: { platform: PlatformType },
};
type SaveQuestionnaireSuccessAction = {
  type: 'SAVE_QUESTIONNAIRE_SUCCESS',
};
type SaveQuestionnaireFailureAction = {
  type: 'SAVE_QUESTIONNAIRE_FAILURE',
};
type SaveQuestionnaireRequestAction = {
  type: 'SAVE_QUESTIONNAIRE_REQUEST',
};
type SaveQuestionnaireUncheckedError = {
  type: 'SAVE_QUESTIONNAIRE_UNCHECKED_ERROR',
};
type HideModalAction = {
  type: 'HIDE_CURRENT_MODAL',
};
type SetSquadFilterAction = {
  type: 'SET_SQUAD_FILTER',
  payload: { squadId: string },
};
type SetMassInput = {
  type: 'SET_MASS_INPUT',
  payload: { isMassInput: boolean },
};
type setShowWarningMessage = {
  type: 'SET_SHOW_WARNING_MESSAGE',
  payload: { showWarningMessage: boolean },
};
type clearAllVisibleVariablesAction = {
  type: 'CLEAR_ALL_VISIBLE_VARIABLES',
  payload: { athleteIds: Array<number>, variableIds: Array<string> },
};

export type Action =
  | ToggleVariableAction
  | ToggleAllVariablesAction
  | ToggleAllAthletesAction
  | SetPlatformAction
  | SaveQuestionnaireSuccessAction
  | SaveQuestionnaireFailureAction
  | SaveQuestionnaireRequestAction
  | SaveQuestionnaireUncheckedError
  | HideModalAction
  | SetSquadFilterAction
  | SetMassInput
  | setShowWarningMessage
  | clearAllVisibleVariablesAction
  | HideDialogueAction
  | ShowDialogueAction;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
