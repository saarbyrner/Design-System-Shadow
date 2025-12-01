// @flow
/* eslint-disable no-use-before-define */

import type {
  AssessmentItem,
  Athlete,
  CommentsViewType,
  EditedComments,
  GridData,
  SelectedGridDetails,
  AssessmentGroup,
  AssessmentTemplate,
} from '../../../types';
import type { Store } from './store';

/* ------------ assessmentTemplates ACTIONS ----------*/
type setAssessmentTemplates = {
  type: 'SET_ASSESSMENT_TEMPLATES',
  payload: {
    assessmentTemplates: Array<AssessmentTemplate>,
  },
};

/* ------------ assessments ACTIONS ----------*/
type saveAssessmentSuccess = {
  type: 'SAVE_ASSESSMENT_SUCCESS',
  payload: {
    assessment: AssessmentGroup,
  },
};

type getAssessmentsSuccess = {
  type: 'FETCH_ASSESSMENTS_SUCCESS',
  payload: { assessments: Array<AssessmentGroup> },
};

/* ------------ comments ACTIONS ------------ */
type setAthleteComments = {
  type: 'SET_ATHLETE_COMMENTS',
  payload: {
    grid: GridData,
    athleteId: number,
  },
};

type setAthleteLinkedToComments = {
  type: 'SET_ATHLETE_LINKED_TO_COMMENTS',
  payload: {
    athlete: Athlete,
  },
};

type setCommentsPanelViewType = {
  type: 'SET_COMMENTS_PANEL_VIEW_TYPE',
  payload: {
    viewType: CommentsViewType,
  },
};

type setIsCommentsSidePanelOpen = {
  type: 'SET_IS_COMMENTS_SIDE_PANEL_OPEN',
  payload: {
    isOpen: boolean,
  },
};

type updateAthleteComments = {
  type: 'UPDATE_ATHLETE_COMMENTS',
  payload: {
    athleteId: number,
    newComments: EditedComments,
    assessmentItems: Array<AssessmentItem>,
  },
};

/* ------------ grid ACTIONS ------------ */
type fetchGridSuccess = {
  type: 'FETCH_GRID_SUCCESS',
  payload: {
    grid: GridData,
    reset: boolean,
  },
};

type updateGrid = {
  type: 'UPDATE_GRID',
  payload: {
    newGrid: GridData,
  },
};

type updateGridRow = {
  type: 'UPDATE_GRID_ROW',
  payload: {
    attributes: Object,
    rowId: number,
  },
};
type resetGrid = {
  type: 'RESET_GRID',
  payload: {
    grid: GridData,
  },
};

/* ------------ gridDetails ACTIONS ------------ */
type setSelectedGridDetails = {
  type: 'SET_SELECTED_GRID_DETAILS',
  payload: {
    gridDetails: SelectedGridDetails,
  },
};
type clearUpdatedGridRows = {
  type: 'CLEAR_UPDATED_GRID_ROWS',
};

/* ------------ appState ACTIONS ------------ */
type requestPending = {
  type: 'REQUEST_PENDING',
};
type requestFailure = {
  type: 'REQUEST_FAILURE',
};
type requestSuccess = {
  type: 'REQUEST_SUCCESS',
};
type setRequestStatus = {
  type: 'SET_REQUEST_STATUS',
  payload: {
    requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  },
};

export type Action =
  | setAssessmentTemplates
  | getAssessmentsSuccess
  | saveAssessmentSuccess
  | setAthleteComments
  | setAthleteLinkedToComments
  | setCommentsPanelViewType
  | setIsCommentsSidePanelOpen
  | updateAthleteComments
  | fetchGridSuccess
  | updateGrid
  | updateGridRow
  | setSelectedGridDetails
  | clearUpdatedGridRows
  | requestPending
  | requestFailure
  | requestSuccess
  | setRequestStatus
  | resetGrid;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
