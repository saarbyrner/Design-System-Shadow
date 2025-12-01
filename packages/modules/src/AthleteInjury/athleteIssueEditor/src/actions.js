// @flow

import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import type { DropdownItem } from '@kitman/components/src/types';
import type { Action } from '../../types/action';

import {
  formatGameOptionsFromObject,
  formatTrainingSessionOptionsFromObject,
  transformIssueRequest,
  getPriorIssueFromIssueId,
} from './utils';

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const serverRequestSuccess = (): Action => {
  window.location.reload(true);
  return {
    type: 'SERVER_REQUEST_SUCCESS',
  };
};

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const addNewEvent = (): Action => ({
  type: 'ADD_NEW_EVENT',
});

export const removeEvent = (statusId: number): Action => ({
  type: 'REMOVE_EVENT',
  payload: {
    statusId,
  },
});

export const updateBamicGradeId = (gradeId: number | string): Action => ({
  type: 'UPDATE_BAMIC_GRADE_ID',
  payload: {
    gradeId,
  },
});

export const updateBamicSiteId = (siteId: ?string): Action => ({
  type: 'UPDATE_BAMIC_SITE_ID',
  payload: {
    siteId,
  },
});

export const updateHasRecurrence = (hasRecurrence: boolean): Action => ({
  type: 'UPDATE_HAS_RECURRENCE',
  payload: {
    hasRecurrence,
  },
});

export const updateHasSupplementaryPathology = (
  hasSupplementaryPathology: boolean
): Action => ({
  type: 'UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY',
  payload: {
    hasSupplementaryPathology,
  },
});

export const updateSupplementaryPathology = (
  supplementaryPathology: ?string
): Action => ({
  type: 'UPDATE_SUPPLEMENTARY_PATHOLOGY',
  payload: {
    supplementaryPathology,
  },
});

export const updateIsRestricted = (isRestricted: boolean): Action => ({
  type: 'UPDATE_IS_RESTRICTED',
  payload: {
    isRestricted,
  },
});

export const updatePsychOnly = (psychOnly: boolean): Action => ({
  type: 'UPDATE_PSYCH_ONLY',
  payload: {
    psychOnly,
  },
});

export const updateExaminationDate = (examinationDate: string): Action => ({
  type: 'UPDATE_EXAMINATION_DATE',
  payload: {
    examinationDate,
  },
});

export const updateIssueStatus = (
  optionId: string,
  statusId: string
): Action => ({
  type: 'UPDATE_ISSUE_STATUS',
  payload: {
    optionId,
    statusId,
  },
});

export const updateEventDate = (
  editedDate: string,
  statusId: string
): Action => ({
  type: 'UPDATE_EVENT_DATE',
  payload: {
    editedDate,
    statusId,
  },
});

export const updateIssueInfo = (issueInfo: string): Action => ({
  type: 'UPDATE_ISSUE_INFO',
  payload: {
    issueInfo,
  },
});

export const updateNote = (note: string): Action => ({
  type: 'UPDATE_NOTE',
  payload: {
    note,
  },
});

export const updateOsicsPathology = (osicsPathology: string): Action => ({
  type: 'UPDATE_OSICS_PATHOLOGY',
  payload: {
    osicsPathology,
  },
});

export const updateOsicsClassification = (
  osicsClassification: string
): Action => ({
  type: 'UPDATE_OSICS_CLASSIFICATION',
  payload: {
    osicsClassification,
  },
});

export const updateBodyArea = (bodyArea: string): Action => ({
  type: 'UPDATE_BODY_AREA',
  payload: {
    bodyArea,
  },
});

export const updateSide = (side: string): Action => ({
  type: 'UPDATE_SIDE',
  payload: {
    side,
  },
});

export const updateType = (typeId: number): Action => ({
  type: 'UPDATE_TYPE',
  payload: {
    typeId,
  },
});

export const updateOsicsCode = (osicsCode: string): Action => ({
  type: 'UPDATE_OSICS_CODE',
  payload: {
    osicsCode,
  },
});

export const updateIcdCode = (icdCode: string): Action => ({
  type: 'UPDATE_ICD_CODE',
  payload: {
    icdCode,
  },
});

export const updatePeriod = (periodId: number): Action => ({
  type: 'UPDATE_PERIOD',
  payload: {
    periodId,
  },
});

export const updateRecurrence =
  (issueId: number) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    // if the issue is an injury, find the prior injury from the issue id
    // otherwise find the prior illness.
    const priorIssues =
      getState().ModalData.formType === 'INJURY'
        ? getState().ModalData.priorIssues.prior_injuries
        : getState().ModalData.priorIssues.prior_illnesses;

    const priorIssue = getPriorIssueFromIssueId(priorIssues, issueId);

    dispatch({
      type: 'UPDATE_RECURRENCE',
      payload: {
        priorIssue,
      },
    });

    // When updating the recurrence, we reset the issue occurrence date.
    // It simplifies the validation, the datepicker won't accept dates
    // before the resolve date of the recurrence.
    dispatch({
      type: 'UPDATE_OCCURRENCE_DATE',
      payload: {
        occurrenceDate: null,
      },
    });
  };

export const isFetchingIssueDetails = (requestInProgress: boolean): Action => ({
  type: 'IS_FETCHING_ISSUE_DETAILS',
  payload: {
    requestInProgress,
  },
});

export const populateIssueDetails =
  (osicsPathology: string) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(isFetchingIssueDetails(true));
    $.ajax({
      method: 'GET',
      url: `/athletes/${
        getState().ModalData.athleteId
      }/issues/osics_info/?id=${osicsPathology}`,
      success: (osicsData) => {
        dispatch(isFetchingIssueDetails(false));
        dispatch(updateOsicsPathology(osicsPathology));
        dispatch(updateOsicsClassification(osicsData.osics_classification_id));
        dispatch(updateBodyArea(osicsData.osics_body_area_id));
        dispatch(updateOsicsCode(osicsData.id));
        dispatch(updateIcdCode(osicsData.icd));
      },
      error: () => {
        dispatch(isFetchingIssueDetails(false));
        dispatch(serverRequestError());
      },
    });
  };

export const updateOccurrenceDate = (occurrenceDate: string): Action => ({
  type: 'UPDATE_OCCURRENCE_DATE',
  payload: {
    occurrenceDate,
  },
});

export const updatePositionGroup = (positionGroupId: ?string): Action => ({
  type: 'UPDATE_POSITION_GROUP',
  payload: {
    positionGroupId,
  },
});

export const updateActivity =
  (activityId: string, activityType: string) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    // The position when injured should default to the athlete position
    // if the activity type is a game
    const newPositionGroup = getState().ModalData.athletePositionId;
    dispatch(updatePositionGroup(newPositionGroup));
    dispatch({
      type: 'UPDATE_ACTIVITY',
      payload: {
        activityId,
        activityType,
      },
    });
  };

export const updateTrainingSession = (trainingSessionId: ?string): Action => ({
  type: 'UPDATE_TRAINING_SESSION',
  payload: {
    trainingSessionId,
  },
});

export const updateGame = (gameId: ?string, gameDate: ?string): Action => ({
  type: 'UPDATE_GAME',
  payload: {
    gameId,
    gameDate,
  },
});

export const updateGameTime = (gameTime: ?string): Action => ({
  type: 'UPDATE_GAME_TIME',
  payload: {
    gameTime,
  },
});

export const updateSessionCompleted = (
  isSessionCompleted: boolean
): Action => ({
  type: 'UPDATE_SESSION_COMPLETED',
  payload: {
    isSessionCompleted,
  },
});

export const updateGameOptions = (
  gameOptions: Array<DropdownItem>
): Action => ({
  type: 'UPDATE_GAME_OPTIONS',
  payload: {
    gameOptions,
  },
});

export const updateFormType = (formType: 'INJURY' | 'ILLNESS'): Action => ({
  type: 'UPDATE_FORM_TYPE',
  payload: {
    formType,
  },
});

export const updateTrainingOptions = (
  trainingOptions: Array<DropdownItem>
): Action => ({
  type: 'UPDATE_TRAINING_OPTIONS',
  payload: {
    trainingOptions,
  },
});

export const isFetchingGameAndTrainingOptions = (
  requestInProgress: boolean
): Action => ({
  type: 'IS_FETCHING_GAME_AND_TRAINING_OPTION',
  payload: {
    requestInProgress,
  },
});

export const getGameAndTrainingOptions =
  (occurrenceDate: string) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(isFetchingGameAndTrainingOptions(true));
    $.ajax({
      method: 'GET',
      url: `/athletes/${
        getState().ModalData.athleteId
      }/injuries/game_and_training_options`,
      data: { date: occurrenceDate },
      success: (data) => {
        dispatch(isFetchingGameAndTrainingOptions(false));
        const gameOptions = formatGameOptionsFromObject(data.games);
        const trainingSessionOptions = formatTrainingSessionOptionsFromObject(
          data.training_sessions
        );

        dispatch(updateGameOptions(gameOptions));
        dispatch(updateTrainingOptions(trainingSessionOptions));
      },
      error: () => {
        dispatch(isFetchingGameAndTrainingOptions(false));
        dispatch(serverRequestError());
      },
    });
  };
/* eslint-enable max-statements */

export const editIssue =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'PUT',
      contentType: 'application/json',
      url:
        getState().ModalData.formType === 'INJURY'
          ? `/athletes/${getState().ModalData.athleteId}/injuries/${
              getState().IssueData.id
            }`
          : `/athletes/${getState().ModalData.athleteId}/illnesses/${
              getState().IssueData.id
            }`,
      data: transformIssueRequest(
        getState().IssueData,
        getState().CurrentNote,
        getState().ModalData.formType
      ),
      success: () => {
        dispatch(serverRequestSuccess());

        if (getState().ModalData.formType === 'INJURY') {
          TrackEvent('injury modal', 'click', 'edit injury');
        } else {
          TrackEvent('illness modal', 'click', 'edit illness');
        }
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const createIssue =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url:
        getState().ModalData.formType === 'INJURY'
          ? `/athletes/${getState().ModalData.athleteId}/injuries`
          : `/athletes/${getState().ModalData.athleteId}/illnesses`,
      data: transformIssueRequest(
        getState().IssueData,
        getState().CurrentNote,
        getState().ModalData.formType
      ),
      success: () => {
        dispatch(serverRequestSuccess());

        if (getState().ModalData.formType === 'INJURY') {
          TrackEvent('injury modal', 'click', 'create injury');
        } else {
          TrackEvent('illness modal', 'click', 'create illness');
        }
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };
