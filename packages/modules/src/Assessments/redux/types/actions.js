// @flow
/* eslint-disable no-use-before-define */

import $ from 'jquery';
import type {
  Assessment,
  AssessmentItem,
  AssessmentTemplate,
  ViewType,
  Athlete,
  EditedComments,
  EditedScores,
} from '../../types';
import type { Store } from './store';

type assessmentsLoading = {
  type: 'ASSESSMENT_LOADING',
  payload: {
    lastFetchAssessmentsXHR: $.JQueryXHR,
  },
};

type fetchAssessmentsFailure = {
  type: 'FETCH_ASSESSMENTS_FAILURE',
};

type fetchAssessmentsSuccess = {
  type: 'FETCH_ASSESSMENTS_SUCCESS',
  payload: {
    assessments: Array<Assessment>,
    nextAssessmentId: ?number,
    reset: ?boolean,
  },
};

type requestPending = {
  type: 'REQUEST_PENDING',
};

type requestFailure = {
  type: 'REQUEST_FAILURE',
};

type saveAssessmentSuccess = {
  type: 'SAVE_ASSESSMENT_SUCCESS',
  payload: {
    assessment: Assessment,
  },
};

type deleteAssessmentSuccess = {
  type: 'DELETE_ASSESSMENT_SUCCESS',
  payload: {
    assessmentId: number,
  },
};

type deleteAssessmentItemSuccess = {
  type: 'DELETE_ASSESSMENT_ITEM_SUCCESS',
  payload: {
    assessmentId: number,
    assessmentItemId: number,
  },
};

type saveAssessmentItemSuccess = {
  type: 'SAVE_ASSESSMENT_ITEM_SUCCESS',
  payload: {
    assessmentId: number,
    assessmentItem: AssessmentItem,
    athleteId: number,
  },
};

type saveTemplateSuccess = {
  type: 'SAVE_TEMPLATE_SUCCESS',
  payload: {
    assessmentId: number,
    template: AssessmentTemplate,
  },
};

type deleteTemplateSuccess = {
  type: 'DELETE_TEMPLATE_SUCCESS',
  payload: {
    templateId: number,
  },
};

type renameTemplateSuccess = {
  type: 'RENAME_TEMPLATE_SUCCESS',
  payload: {
    templateId: number,
    templateName: string,
  },
};

type applyTemplateFilter = {
  type: 'APPLY_TEMPLATE_FILTER',
  payload: {
    filteredTemplates: Array<number>,
  },
};

type updateTemplateSuccess = {
  type: 'UPDATE_TEMPLATE_SUCCESS',
  payload: {
    assessmentTemplateId: number,
  },
};

type updateTemplatePending = {
  type: 'UPDATE_TEMPLATE_PENDING',
  payload: {
    assessmentTemplate: AssessmentTemplate,
  },
};

type updateTemplateFailure = {
  type: 'UPDATE_TEMPLATE_FAILURE',
  payload: {
    assessmentTemplateId: number,
  },
};

type removeToast = {
  type: 'REMOVE_TOAST',
  payload: {
    toastId: number,
  },
};

type saveAssessmentItemsOrderSuccess = {
  type: 'SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS',
  payload: {
    assessment: Assessment,
  },
};

type updateViewType = {
  type: 'UPDATE_VIEW_TYPE',
  payload: {
    viewType: ViewType,
  },
};

type selectAthlete = {
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId: ?number,
  },
};

type saveAssessmentAthletesSuccess = {
  type: 'SAVE_ASSESSMENT_ATHLETES_SUCCESS',
  payload: {
    assessmentId: number,
    athletes: Array<Athlete>,
  },
};

type saveAssessmentItemCommentsSuccess = {
  type: 'SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS',
  payload: {
    assessmentId: number,
    comments: EditedComments,
  },
};

type saveMetricScoresSuccess = {
  type: 'SAVE_METRIC_SCORES_SUCCESS',
  payload: {
    assessmentId: number,
    scores: EditedScores,
  },
};

type fetchAssessmentWithAnswersSuccess = {
  type: 'FETCH_ASSESSMENT_WITH_ANSWERS_SUCCESS',
  payload: {
    assessmentId: number,
    assessment: Assessment,
  },
};

export type Action =
  | assessmentsLoading
  | fetchAssessmentsFailure
  | fetchAssessmentsSuccess
  | requestPending
  | requestFailure
  | saveAssessmentSuccess
  | deleteAssessmentSuccess
  | deleteAssessmentItemSuccess
  | saveAssessmentItemSuccess
  | saveTemplateSuccess
  | deleteTemplateSuccess
  | renameTemplateSuccess
  | applyTemplateFilter
  | updateTemplateSuccess
  | updateTemplatePending
  | updateTemplateFailure
  | removeToast
  | saveAssessmentItemsOrderSuccess
  | updateViewType
  | selectAthlete
  | saveAssessmentAthletesSuccess
  | saveAssessmentItemCommentsSuccess
  | saveMetricScoresSuccess
  | fetchAssessmentWithAnswersSuccess;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
