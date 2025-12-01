// @flow
import type { DropdownItem } from '@kitman/components/src/types';
import type { PriorIssue } from './_common';

type addNewInjuryOccurrenceEvent = {
  type: 'ADD_NEW_EVENT',
};

type removeInjuryOccurrenceEvent = {
  type: 'REMOVE_EVENT',
  payload: {
    statusId: number,
  },
};

type updateBamicGradeId = {
  type: 'UPDATE_BAMIC_GRADE_ID',
  payload: {
    gradeId: number | string,
  },
};

type updateBamicSiteId = {
  type: 'UPDATE_BAMIC_SITE_ID',
  payload: {
    siteId: ?string,
  },
};

type updateHasSupplementaryPathology = {
  type: 'UPDATE_HAS_SUPPLEMENTARY_PATHOLOGY',
  payload: {
    hasSupplementaryPathology: boolean,
  },
};

type updateSupplementaryPathology = {
  type: 'UPDATE_SUPPLEMENTARY_PATHOLOGY',
  payload: {
    supplementaryPathology: ?string,
  },
};

type updateHasRecurrence = {
  type: 'UPDATE_HAS_RECURRENCE',
  payload: {
    hasRecurrence: boolean,
  },
};

type updateIsRestricted = {
  type: 'UPDATE_IS_RESTRICTED',
  payload: {
    isRestricted: boolean,
  },
};

type updatePsychOnly = {
  type: 'UPDATE_PSYCH_ONLY',
  payload: {
    psychOnly: boolean,
  },
};

type updateExaminationDate = {
  type: 'UPDATE_EXAMINATION_DATE',
  payload: {
    examinationDate: string,
  },
};

type updateRecurrence = {
  type: 'UPDATE_RECURRENCE',
  payload: {
    priorIssue: PriorIssue,
  },
};

type updateIssueStatus = {
  type: 'UPDATE_ISSUE_STATUS',
  payload: {
    optionId: string,
    statusId: string,
  },
};

type updateInjuryOccurrenceEventDate = {
  type: 'UPDATE_EVENT_DATE',
  payload: {
    editedDate: string,
    statusId: string,
  },
};

type updateIssueInfo = {
  type: 'UPDATE_ISSUE_INFO',
  payload: {
    issueInfo: string,
  },
};

type updateNote = {
  type: 'UPDATE_NOTE',
  payload: {
    note: string,
  },
};

type updateOsicsPathology = {
  type: 'UPDATE_OSICS_PATHOLOGY',
  payload: {
    osicsPathology: string,
  },
};

type updateOsicsClassification = {
  type: 'UPDATE_OSICS_CLASSIFICATION',
  payload: {
    osicsClassification: string,
  },
};

type updateBodyArea = {
  type: 'UPDATE_BODY_AREA',
  payload: {
    bodyArea: string,
  },
};

type updateSide = {
  type: 'UPDATE_SIDE',
  payload: {
    side: string,
  },
};

type updateInjuryType = {
  type: 'UPDATE_TYPE',
  payload: {
    typeId: number,
  },
};

type updateOsicsCode = {
  type: 'UPDATE_OSICS_CODE',
  payload: {
    osicsCode: string,
  },
};

type updateIcdCode = {
  type: 'UPDATE_ICD_CODE',
  payload: {
    icdCode: string,
  },
};

type updateOccurrenceDate = {
  type: 'UPDATE_OCCURRENCE_DATE',
  payload: {
    occurrenceDate: ?string,
  },
};

type updateActivity = {
  type: 'UPDATE_ACTIVITY',
  payload: {
    activityId: string,
    activityType: string,
  },
};

type updateTrainingSession = {
  type: 'UPDATE_TRAINING_SESSION',
  payload: {
    trainingSessionId: ?string,
  },
};

type updateGame = {
  type: 'UPDATE_GAME',
  payload: {
    gameId: ?string,
    gameDate: ?string,
  },
};

type updatePeriod = {
  type: 'UPDATE_PERIOD',
  payload: {
    periodId: number,
  },
};

type updateGameTime = {
  type: 'UPDATE_GAME_TIME',
  payload: {
    gameTime: ?string,
  },
};

type updateSessionCompleted = {
  type: 'UPDATE_SESSION_COMPLETED',
  payload: {
    isSessionCompleted: boolean,
  },
};

type updatePositionGroup = {
  type: 'UPDATE_POSITION_GROUP',
  payload: {
    positionGroupId: ?string,
  },
};

type updateGameOptions = {
  type: 'UPDATE_GAME_OPTIONS',
  payload: {
    gameOptions: Array<DropdownItem>,
  },
};

type updateTrainingOptions = {
  type: 'UPDATE_TRAINING_OPTIONS',
  payload: {
    trainingOptions: Array<DropdownItem>,
  },
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type serverRequestSuccess = {
  type: 'SERVER_REQUEST_SUCCESS',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type isFetchingIssueDetails = {
  type: 'IS_FETCHING_ISSUE_DETAILS',
  payload: {
    requestInProgress: boolean,
  },
};

type isFetchingGameAndTrainingOptions = {
  type: 'IS_FETCHING_GAME_AND_TRAINING_OPTION',
  payload: {
    requestInProgress: boolean,
  },
};

type updateFormType = {
  type: 'UPDATE_FORM_TYPE',
  payload: {
    formType: 'INJURY' | 'ILLNESS',
  },
};

export type Action =
  | addNewInjuryOccurrenceEvent
  | removeInjuryOccurrenceEvent
  | updateBamicGradeId
  | updateBamicSiteId
  | updateHasRecurrence
  | updateIsRestricted
  | updatePsychOnly
  | updateExaminationDate
  | updateRecurrence
  | updateIssueStatus
  | updateInjuryOccurrenceEventDate
  | updateIssueInfo
  | updateNote
  | updateOsicsPathology
  | updateOsicsClassification
  | updateBodyArea
  | updateSide
  | updateHasSupplementaryPathology
  | updateSupplementaryPathology
  | updateInjuryType
  | updateOsicsCode
  | updateIcdCode
  | updateOccurrenceDate
  | updateActivity
  | updateTrainingSession
  | updateGame
  | updatePeriod
  | updateGameTime
  | updateSessionCompleted
  | updatePositionGroup
  | updateGameOptions
  | updateTrainingOptions
  | serverRequest
  | serverRequestError
  | serverRequestSuccess
  | hideAppStatus
  | isFetchingIssueDetails
  | isFetchingGameAndTrainingOptions
  | updateFormType;
