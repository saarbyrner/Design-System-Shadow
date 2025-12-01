// @flow
import type { GraphType, GraphGroup } from '@kitman/common/src/types/Graphs';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

type updateGraphFormType = {
  type: 'UPDATE_GRAPH_FORM_TYPE',
  payload: {
    graphType: GraphType,
    graphGroup: GraphGroup,
  },
};

type updateCodingSystemCategorySelections = {
  type: 'UPDATE_CODING_SYSTEM_CATEGORY_SELECTIONS',
  payload: {
    injuryPathologies: Pathologies,
    illnessPathologies: Pathologies,
    injuryClassifications: Classifications,
    illnessClassifications: Classifications,
    injuryBodyAreas: BodyAreas,
    illnessBodyAreas: BodyAreas,
  },
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type eventTypeRequest = {
  type: 'EVENT_TYPE_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type createNewGraph = {
  type: 'CREATE_NEW_GRAPH',
};

type closeDashboardSelectorModal = {
  type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
};

type openDashboardSelectorModal = {
  type: 'OPEN_DASHBOARD_SELECTOR_MODAL',
};

type selectDashboard = {
  type: 'SELECT_DASHBOARD',
  payload: {
    selectedDashboard: string,
  },
};

type closeRenameGraphModal = {
  type: 'CLOSE_RENAME_GRAPH_MODAL',
};

type openRenameGraphModal = {
  type: 'OPEN_RENAME_GRAPH_MODAL',
};

type onRenameGraphValueChange = {
  type: 'ON_RENAME_VALUE_CHANGE',
  payload: {
    value: string,
  },
};

type confirmRenameGraph = {
  type: 'CONFIRM_RENAME_GRAPH',
  payload: {
    newGraphName: string,
    graphGroup: GraphGroup,
  },
};

export type Action =
  | updateGraphFormType
  | updateCodingSystemCategorySelections
  | serverRequest
  | eventTypeRequest
  | serverRequestError
  | hideAppStatus
  | createNewGraph
  | closeRenameGraphModal
  | openRenameGraphModal
  | onRenameGraphValueChange
  | confirmRenameGraph
  | closeDashboardSelectorModal
  | openDashboardSelectorModal
  | selectDashboard;
