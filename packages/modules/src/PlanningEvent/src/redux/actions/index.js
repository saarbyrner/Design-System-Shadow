// @flow
import $ from 'jquery';
import type {
  AssessmentItem,
  Athlete,
  CommentsViewType,
  EditedComments,
  GridData,
  SelectedGridDetails,
  AssessmentGroup,
  AthleteFilter,
  AssessmentTemplate,
} from '../../../types';
import type { Action, ThunkAction } from '../types/actions';

/* ------------ assessmentTemplates ACTIONS ------------ */
export const setAssessmentTemplates = (
  assessmentTemplates: Array<AssessmentTemplate>
): Action => ({
  type: 'SET_ASSESSMENT_TEMPLATES',
  payload: {
    assessmentTemplates,
  },
});

/* ------------ comments ACTIONS ------------ */
export const setAthleteComments = (
  grid: GridData,
  athleteId: number
): Action => ({
  type: 'SET_ATHLETE_COMMENTS',
  payload: {
    grid,
    athleteId,
  },
});

export const setAthleteLinkedToComments = (athlete: Athlete): Action => ({
  type: 'SET_ATHLETE_LINKED_TO_COMMENTS',
  payload: {
    athlete,
  },
});

export const setCommentsPanelViewType = (
  viewType: CommentsViewType
): Action => ({
  type: 'SET_COMMENTS_PANEL_VIEW_TYPE',
  payload: {
    viewType,
  },
});

export const setIsCommentsSidePanelOpen = (isOpen: boolean): Action => ({
  type: 'SET_IS_COMMENTS_SIDE_PANEL_OPEN',
  payload: {
    isOpen,
  },
});

export const updateAthleteComments = (
  athleteId: number,
  newComments: EditedComments,
  assessmentItems: Array<AssessmentItem>
): Action => ({
  type: 'UPDATE_ATHLETE_COMMENTS',
  payload: {
    athleteId,
    newComments,
    assessmentItems,
  },
});

/* ------------ grid ACTIONS ------------ */
export const fetchGridSuccess = (grid: GridData, reset: boolean): Action => ({
  type: 'FETCH_GRID_SUCCESS',
  payload: {
    grid,
    reset,
  },
});

export const updateGrid = (newGrid: GridData): Action => ({
  type: 'UPDATE_GRID',
  payload: {
    newGrid,
  },
});

export const updateGridRow = (attributes: Object, rowId: number): Action => ({
  type: 'UPDATE_GRID_ROW',
  payload: {
    attributes,
    rowId,
  },
});

export const resetGrid = (): Action => ({
  type: 'RESET_GRID',
  payload: {
    grid: {
      columns: [],
      next_id: null,
      rows: [],
    },
  },
});

/* ------------ gridDetails ACTIONS ------------ */
export const setSelectedGridDetails = (
  gridDetails: SelectedGridDetails
): Action => ({
  type: 'SET_SELECTED_GRID_DETAILS',
  payload: {
    gridDetails,
  },
});

export const clearUpdatedGridRows = (): Action => ({
  type: 'CLEAR_UPDATED_GRID_ROWS',
});

/* ------------ appState ACTIONS ------------ */
export const requestPending = (): Action => ({
  type: 'REQUEST_PENDING',
});

export const requestFailure = (): Action => ({
  type: 'REQUEST_FAILURE',
});

export const requestSuccess = (): Action => ({
  type: 'REQUEST_SUCCESS',
});

export const setRequestStatus = (
  requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS'
): Action => ({
  type: 'SET_REQUEST_STATUS',
  payload: {
    requestStatus,
  },
});

/* ------------- ASSESSMENTS ACTIONS ------------ */

export const saveAssessmentSuccess = (assessment: AssessmentGroup): Action => ({
  type: 'SAVE_ASSESSMENT_SUCCESS',
  payload: {
    assessment,
  },
});

export const getAssessmentsSuccess = (
  assessments: Array<AssessmentGroup>
): Action => ({
  type: 'FETCH_ASSESSMENTS_SUCCESS',
  payload: { assessments },
});

/* ------------ THUNK ACTIONS ------------ */
export const fetchWorkloadGrid =
  (
    eventId: number,
    reset: boolean,
    nextId: number,
    filters: ?AthleteFilter
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    if (reset) {
      dispatch(resetGrid());
      dispatch(requestPending());
    }

    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/collections_tab`,
      contentType: 'application/json',
      data: JSON.stringify({
        next_id: nextId || null,
        filters,
      }),
    })
      .done((grid) => {
        dispatch(fetchGridSuccess(grid, reset));
        dispatch(
          setSelectedGridDetails({
            id: 'default',
            name: 'Workload',
            type: 'DEFAULT',
            updatedWorkloadGridRows: [],
            updatedAssessmentGridRows: [],
          })
        );
        dispatch(requestSuccess());
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
export const fetchAssessmentGrid =
  (
    eventId: number,
    reset: boolean,
    nextId: ?number,
    filters: ?AthleteFilter,
    gridDetailsId: ?number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (reset) {
      dispatch(resetGrid());
      dispatch(requestPending());
    }
    const assessmentGroupId =
      gridDetailsId || getState().planningEvent.gridDetails.id;

    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/collections/assessments`,
      contentType: 'application/json',
      data: JSON.stringify({
        assessment_group_id: assessmentGroupId,
        next_id: nextId || null,
        filters,
      }),
    })
      .done((grid) => {
        dispatch(fetchGridSuccess(grid, reset));
        dispatch(requestSuccess());
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
export const saveAthleteComments =
  (comments: EditedComments): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    $.ajax({
      method: 'PATCH',
      url: `/assessment_groups/${
        getState().planningEvent.gridDetails.id
      }/comments`,
      contentType: 'application/json',
      data: JSON.stringify({
        comments,
      }),
    })
      .done((assessmentItems) => {
        dispatch(
          updateAthleteComments(
            getState().planningEvent.comments.athleteLinkedToComments.id,
            comments,
            assessmentItems.items
          )
        );
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
export const saveAssessmentGridAttributes =
  (eventId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(requestPending());
    const updatedAthletes =
      getState().planningEvent.gridDetails.updatedAssessmentGridRows;
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/grid_columns/upsert_column_value`,
      contentType: 'application/json',
      data: JSON.stringify({
        scores: updatedAthletes.map((athlete) => ({
          athlete_id: athlete.id,
          value: athlete.value,
          assessment_item_id: athlete.assessmentItemId,
        })),
        tab: 'collections_tab_assessment',
        assessment_group_id: getState().planningEvent.gridDetails.id,
      }),
    })
      .done((newGrid) => {
        dispatch(updateGrid(newGrid));
        dispatch(requestSuccess());
        dispatch(clearUpdatedGridRows());
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
export const saveWorkloadGridAttributes =
  (eventId: number, tab: 'collections_tab' | 'athletes_tab'): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(requestPending());
    const athletes =
      getState().planningEvent.gridDetails.updatedWorkloadGridRows.map(
        (athleteId) => {
          const athleteAttributes = getState().planningEvent.grid.rows.find(
            ({ athlete }) => athlete.id === athleteId
          );
          let workloadUnits = {};
          if (
            window.getFlag('event-collection-show-sports-specific-workload-units')
          ) {
            const workloadColumns =
              getState().planningEvent.grid.columns.filter(
                (c) => c.workload_unit
              );
            workloadUnits = Object.assign(
              {},
              ...workloadColumns.map((c) => ({
                [c.row_key]: athleteAttributes[c.row_key],
              }))
            );
          }
          return {
            id: athleteAttributes.athlete.id,
            rpe: athleteAttributes.rpe,
            duration: athleteAttributes.minutes,
            workload_units: workloadUnits,
          };
        }
      );
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/athlete_events/update_attributes`,
      contentType: 'application/json',
      data: JSON.stringify({
        athletes,
        tab,
      }),
    })
      .done((newGrid) => {
        dispatch(updateGrid(newGrid));
        dispatch(requestSuccess());
        dispatch(clearUpdatedGridRows());
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };
export const fetchAssessmentGroups =
  (eventId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) =>
    new Promise((resolve) => {
      $.ajax({
        method: 'GET',
        url: `/planning_hub/events/${eventId}/collections/assessment_groups`,
        contentType: 'application/json',
      })
        .done(
          ({
            assessment_groups: assessmentGroups,
            pending_creation: pendingCreation,
          }) => {
            // Provisional condition to handle this request
            if (pendingCreation) {
              if (assessmentGroups.length > 0) {
                dispatch(getAssessmentsSuccess(assessmentGroups));
              }

              resolve(true);
            } else {
              dispatch(getAssessmentsSuccess(assessmentGroups));
              resolve(false);
            }
          }
        )
        .fail(() => {
          dispatch(requestFailure());
        });
    });

export const createAssessmentColumnsFromTemplate =
  (
    assessmentId: number,
    assessmentTemplateId: number,
    eventId: number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/planning_hub/events/${eventId}/collections/assessment_columns`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        assessment_group_id: assessmentId,
        assessment_template_id: assessmentTemplateId,
      }),
    })
      .done(() => {
        dispatch(fetchAssessmentGrid(eventId, true));
      })
      .fail(() => {});
  };

export const updateAssessment =
  (
    assessment: {
      id: number,
      name?: string,
      participation_levels?: Array<number>,
    },
    eventId: number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/assessment_groups/${assessment.id}`,
      contentType: 'application/json',
      method: 'PUT',
      data: JSON.stringify({
        name: assessment.name,
        participation_level_ids: assessment.participation_levels,
      }),
    })
      .done(({ assessment_group: assessmentGroup }) => {
        dispatch(
          saveAssessmentSuccess({
            id: assessmentGroup.id,
            name: assessmentGroup.name,
          })
        );
        dispatch(fetchAssessmentGrid(eventId, true));
        dispatch(fetchAssessmentGroups(eventId));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
  };

export const saveAssessment =
  (assessment: {
    assessment_template_id?: number,
    name: string,
    event_id: number,
    event_type: 'session_event' | 'game_event',
    participation_levels?: Array<number>,
  }): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(requestPending());

    $.ajax({
      url: `/planning_hub/events/${assessment.event_id}/collections/create_assessment_group`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        name: assessment.name,
        assessment_template_id: assessment.assessment_template_id || null,
        participation_levels: assessment.participation_levels,
      }),
    })
      .done(({ assessment_group: assessmentGroup }) => {
        dispatch(
          setSelectedGridDetails({
            id: assessmentGroup.id,
            name: assessment.name,
            type: 'ASSESSMENT',
            updatedWorkloadGridRows: [],
            updatedAssessmentGridRows: [],
          })
        );
        dispatch(
          saveAssessmentSuccess({
            id: assessmentGroup.id,
            name: assessmentGroup.name,
          })
        );
        if (assessment.assessment_template_id) {
          dispatch(
            createAssessmentColumnsFromTemplate(
              assessmentGroup.id,
              assessment.assessment_template_id,
              assessment.event_id
            )
          );
        }
        dispatch(fetchAssessmentGrid(assessment.event_id, true));
        dispatch(fetchAssessmentGroups(assessment.event_id));
      })
      .fail(() => {
        dispatch(requestFailure());
      });
    dispatch(
      setSelectedGridDetails({
        id: assessment.name,
        name: assessment.name,
        type: 'ASSESSMENT',
        updatedWorkloadGridRows: [],
        updatedAssessmentGridRows: [],
      })
    );
  };
