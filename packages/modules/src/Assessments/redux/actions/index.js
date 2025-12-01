// @flow

import $ from 'jquery';
import { isCanceledError } from '@kitman/common/src/utils/services';
import type {
  Assessment,
  AssessmentTemplate,
  AssessmentItem,
  ViewType,
  Athlete,
  EditedComments,
  EditedScores,
} from '../../types';
import type { Action, ThunkAction } from '../types/actions';

export const assessmentsLoading = (
  lastFetchAssessmentsXHR: $.JQueryXHR
): Action => ({
  type: 'ASSESSMENT_LOADING',
  payload: {
    lastFetchAssessmentsXHR,
  },
});

export const fetchAssessmentsSuccess = (
  assessments: Array<Assessment>,
  nextAssessmentId: ?number,
  reset: ?boolean = false
): Action => ({
  type: 'FETCH_ASSESSMENTS_SUCCESS',
  payload: {
    assessments,
    nextAssessmentId,
    reset,
  },
});

export const fetchAssessmentsFailure = (): Action => ({
  type: 'FETCH_ASSESSMENTS_FAILURE',
});

export const saveAssessmentSuccess = (assessment: Assessment): Action => ({
  type: 'SAVE_ASSESSMENT_SUCCESS',
  payload: {
    assessment,
  },
});

export const requestPending = (): Action => ({
  type: 'REQUEST_PENDING',
});

export const requestFailure = (): Action => ({
  type: 'REQUEST_FAILURE',
});

export const abortFetchingAssessments =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    const request = getState().appState.fetchAssessmentsXHR;
    // NOTE: readyState 4 would be complete, so no need to abort
    if (request && request.readyState !== 4) {
      request.abort();
    }
  };

export const fetchAssessments =
  ({
    reset = false,
    athleteIds = null,
    positionGroupIds = null,
    listView = false,
  }: {
    athleteIds?: ?Array<number>,
    positionGroupIds?: ?Array<number>,
    reset: ?boolean,
    listView?: ?boolean,
  }): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (reset && getState().appState.fetchAssessmentsXHR) {
      getState().appState.fetchAssessmentsXHR.abort();
    }

    const fetchAssessmentsXHR = $.ajax({
      url: `/${
        window.getFlag('assessments-multiple-athletes')
          ? 'assessment_groups'
          : 'assessments'
      }/search`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        ...(window.getFlag('assessments-multiple-athletes')
          ? {
              athlete_ids: athleteIds,
            }
          : {
              athlete_id: athleteIds?.length && athleteIds[0],
            }),
        list_view: listView,
        position_group_ids: positionGroupIds,
        assessment_template_ids: getState().appState.filteredTemplates.map(
          // The backend filters out null so we need to send it as a string
          (templateId) => (templateId === null ? 'null' : templateId)
        ),
        next_id: reset ? null : getState().appState.nextAssessmentId,
      }),
      error: (error) => {
        if (!isCanceledError(error)) {
          dispatch(requestFailure());
        }
      },
    })
      .done((data) => {
        let assessments = [];

        if (window.getFlag('assessments-multiple-athletes')) {
          assessments = data.assessment_groups.map((assessment) => ({
            ...assessment,
            isCurrentSquad: assessment.squad.id === getState().currentSquad.id,
          }));
        } else {
          assessments = data.assessments;
        }

        dispatch(fetchAssessmentsSuccess(assessments, data.next_id, reset));
      })
      .fail((error) => {
        if (!isCanceledError(error)) {
          dispatch(requestFailure());
        }
      });
    dispatch(assessmentsLoading(fetchAssessmentsXHR));
  };

export const saveAssessment =
  (assessment: {
    id?: number,
    assessment_template_id: ?number,
    name: string,
    // if assessments-multiple-athletes disabled
    assessment_date: ?string,
    // if assessments-multiple-athletes enabled
    assessment_group_date: ?string,
    event_id: ?number,
    event_type: ?('Fixture' | 'TrainingSession'),
  }): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(requestPending());

    const selectedAthlete = getState().appState.selectedAthlete;

    const assessmentId = assessment.id;
    const url =
      typeof assessmentId === 'number'
        ? `/${
            window.getFlag('assessments-multiple-athletes')
              ? 'assessment_groups'
              : 'assessments'
          }/${assessmentId}`
        : `/${
            window.getFlag('assessments-multiple-athletes')
              ? 'assessment_groups'
              : 'assessments'
          }`;

    $.ajax({
      url,
      contentType: 'application/json',
      method: assessment.id ? 'PUT' : 'POST',
      data: JSON.stringify({
        ...(window.getFlag('assessments-multiple-athletes')
          ? {
              athlete_ids: selectedAthlete ? [selectedAthlete] : [],
              assessment_group_date: assessment.assessment_group_date || null,
            }
          : {
              athlete_id: selectedAthlete,
              assessment_date: assessment.assessment_date || null,
            }),
        name: assessment.name,
        assessment_template_id: assessment.assessment_template_id || null,
        event_type: assessment.event_type || null,
        event_id: assessment.event_id || null,
      }),
    })
      .done((data) => {
        const assessmentData = window.getFlag('assessments-multiple-athletes')
          ? data.assessment_group
          : data.assessment;

        dispatch(
          saveAssessmentSuccess({
            ...assessmentData,
            ...(window.getFlag('assessments-multiple-athletes') && {
              isCurrentSquad:
                assessmentData.squad.id === getState().currentSquad.id,
            }),
          })
        );
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const deleteAssessmentSuccess = (assessmentId: number): Action => ({
  type: 'DELETE_ASSESSMENT_SUCCESS',
  payload: {
    assessmentId,
  },
});

export const deleteAssessment =
  (assessmentId: number, athleteId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    const multipleAthletesEndpoint = `/assessment_groups/${assessmentId}${
      athleteId ? `/athletes/${athleteId}` : ''
    }`;
    const singleAthleteEndpoint = `/assessments/${assessmentId}`;

    $.ajax({
      method: 'DELETE',
      url: window.getFlag('assessments-multiple-athletes')
        ? multipleAthletesEndpoint
        : singleAthleteEndpoint,
    })
      .done(() => {
        dispatch(deleteAssessmentSuccess(assessmentId));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const deleteAssessmentItemSuccess = (
  assessmentId: number,
  assessmentItemId: number
): Action => ({
  type: 'DELETE_ASSESSMENT_ITEM_SUCCESS',
  payload: {
    assessmentId,
    assessmentItemId,
  },
});

export const deleteAssessmentItem =
  (assessmentId: number, assessmentItemId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    const isAssessmentGroups = window.getFlag('assessments-multiple-athletes');

    $.ajax({
      method: 'DELETE',
      url: `/${
        isAssessmentGroups ? 'assessment_groups' : 'assessments'
      }/${assessmentId}/items/${assessmentItemId}`,
    })
      .done(() => {
        dispatch(deleteAssessmentItemSuccess(assessmentId, assessmentItemId));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const saveAssessmentItemSuccess = (
  assessmentId: number,
  assessmentItem: AssessmentItem,
  athleteId: number
): Action => ({
  type: 'SAVE_ASSESSMENT_ITEM_SUCCESS',
  payload: {
    assessmentId,
    assessmentItem,
    athleteId,
  },
});

export const saveAssessmentItem =
  (
    assessmentId: number,
    assessmentItem: AssessmentItem,
    athleteId: number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    const isAssessmentGroups = window.getFlag('assessments-multiple-athletes');

    const url = assessmentItem.id
      ? `/${
          isAssessmentGroups ? 'assessment_groups' : 'assessments'
        }/${assessmentId}/items/${assessmentItem.id}`
      : `/${
          isAssessmentGroups ? 'assessment_groups' : 'assessments'
        }/${assessmentId}/items`;

    $.ajax({
      url,
      contentType: 'application/json',
      method: assessmentItem.id ? 'PUT' : 'POST',
      data: JSON.stringify(assessmentItem),
    })
      .done((data) => {
        dispatch(
          saveAssessmentItemSuccess(
            assessmentId,
            data.assessment_item,
            athleteId
          )
        );
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const saveAssessmentItemCommentsSuccess = (
  assessmentId: number,
  comments: EditedComments
): Action => ({
  type: 'SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS',
  payload: {
    assessmentId,
    comments,
  },
});

export const saveAssessmentItemComments =
  (assessmentId: number, comments: EditedComments): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/assessment_groups/${assessmentId}/comments`,
      contentType: 'application/json',
      method: 'PATCH',
      data: JSON.stringify({ comments }),
    })
      .done(() => {
        dispatch(saveAssessmentItemCommentsSuccess(assessmentId, comments));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const saveMetricScoresSuccess = (
  assessmentId: number,
  scores: EditedScores
): Action => ({
  type: 'SAVE_METRIC_SCORES_SUCCESS',
  payload: {
    assessmentId,
    scores,
  },
});

export const saveMetricScores =
  (assessmentId: number, scores: EditedScores): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/assessment_groups/${assessmentId}/scores`,
      contentType: 'application/json',
      method: 'PATCH',
      data: JSON.stringify({ scores }),
    })
      .done((data) => {
        dispatch(saveMetricScoresSuccess(assessmentId, data.scores));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const saveTemplateSuccess = (
  assessmentId: number,
  template: AssessmentTemplate
): Action => ({
  type: 'SAVE_TEMPLATE_SUCCESS',
  payload: {
    assessmentId,
    template,
  },
});

export const saveTemplate =
  (template: AssessmentTemplate, athleteId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: '/assessment_templates',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({ ...template, athlete_id: athleteId }),
    })
      .done((data) => {
        dispatch(
          saveTemplateSuccess(
            template.assessment_group_id,
            data.assessment_template
          )
        );
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const deleteTemplateSuccess = (templateId: number): Action => ({
  type: 'DELETE_TEMPLATE_SUCCESS',
  payload: {
    templateId,
  },
});

export const deleteTemplate =
  (templateId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      method: 'DELETE',
      url: `/assessment_templates/${templateId}`,
    })
      .done(() => {
        dispatch(deleteTemplateSuccess(templateId));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const renameTemplateSuccess = (
  templateId: number,
  templateName: string
): Action => ({
  type: 'RENAME_TEMPLATE_SUCCESS',
  payload: {
    templateId,
    templateName,
  },
});

export const renameTemplate =
  (templateId: number, templateName: string): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/assessment_templates/${templateId}`,
      contentType: 'application/json',
      method: 'PUT',
      data: JSON.stringify({
        name: templateName,
      }),
    })
      .done(() => {
        dispatch(renameTemplateSuccess(templateId, templateName));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const applyTemplateFilter = (
  filteredTemplates: Array<number>
): Action => ({
  type: 'APPLY_TEMPLATE_FILTER',
  payload: {
    filteredTemplates,
  },
});

export const updateTemplateSuccess = (
  assessmentTemplateId: number
): Action => ({
  type: 'UPDATE_TEMPLATE_SUCCESS',
  payload: {
    assessmentTemplateId,
  },
});

export const updateTemplatePending = (
  assessmentTemplate: AssessmentTemplate
): Action => ({
  type: 'UPDATE_TEMPLATE_PENDING',
  payload: {
    assessmentTemplate,
  },
});

export const updateTemplateFailure = (
  assessmentTemplateId: number
): Action => ({
  type: 'UPDATE_TEMPLATE_FAILURE',
  payload: {
    assessmentTemplateId,
  },
});

export const removeToast = (toastId: number): Action => ({
  type: 'REMOVE_TOAST',
  payload: {
    toastId,
  },
});

export const updateTemplate =
  (
    assessmentId: number,
    assessmentTemplate: AssessmentTemplate,
    athleteId: number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(updateTemplatePending(assessmentTemplate));

    $.ajax({
      url: `/assessment_templates/${assessmentTemplate.id}`,
      contentType: 'application/json',
      method: 'PUT',
      data: JSON.stringify({
        ...(window.getFlag('assessments-multiple-athletes')
          ? {
              assessment_group_id: assessmentId,
            }
          : {
              assessment_id: assessmentId,
            }),
        athlete_id: athleteId,
      }),
    })
      .done(() => {
        dispatch(updateTemplateSuccess(assessmentTemplate.id));
        setTimeout(() => dispatch(removeToast(assessmentTemplate.id)), 6500);
      })
      .fail(() => {
        dispatch(updateTemplateFailure(assessmentTemplate.id));
      });
  };

export const saveAssessmentItemsOrderSuccess = (
  assessment: Assessment
): Action => ({
  type: 'SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS',
  payload: {
    assessment,
  },
});

export const saveAssessmentItemsOrder =
  (assessmentId: number, orderedItemIds: Array<number>): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/${
        window.getFlag('assessments-multiple-athletes')
          ? 'assessment_groups'
          : 'assessments'
      }/${assessmentId}/items/reorder`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        ordered_ids: orderedItemIds,
      }),
    })
      .done((data) => {
        dispatch(saveAssessmentItemsOrderSuccess(data.assessment));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const updateViewType = (viewType: ViewType): Action => ({
  type: 'UPDATE_VIEW_TYPE',
  payload: {
    viewType,
  },
});

export const selectAthlete = (athleteId: ?number): Action => ({
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId,
  },
});

export const saveAssessmentAthletesSuccess = (
  assessmentId: number,
  athletes: Array<Athlete>
): Action => ({
  type: 'SAVE_ASSESSMENT_ATHLETES_SUCCESS',
  payload: {
    assessmentId,
    athletes,
  },
});

export const saveAssessmentAthletes =
  (assessmentId: number, athletes: Array<Athlete>): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/assessment_groups/${assessmentId}/athletes`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        athlete_ids: athletes.map((athlete) => athlete.id),
      }),
    })
      .done(() => {
        dispatch(saveAssessmentAthletesSuccess(assessmentId, athletes));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const fetchAssessmentWithAnswersSuccess = (
  assessmentId: number,
  assessment: Assessment
): Action => ({
  type: 'FETCH_ASSESSMENT_WITH_ANSWERS_SUCCESS',
  payload: {
    assessmentId,
    assessment,
  },
});

export const fetchAssessmentWithAnswers =
  (assessmentId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    $.ajax({
      url: `/assessment_groups/${assessmentId}/contents`,
      contentType: 'application/json',
      method: 'GET',
    })
      .done((data) => {
        dispatch(
          fetchAssessmentWithAnswersSuccess(assessmentId, data.assessment_group)
        );
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
