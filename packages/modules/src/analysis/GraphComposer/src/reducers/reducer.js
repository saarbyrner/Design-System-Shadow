/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from '@kitman/common/src/utils/i18n';

const GraphFormType = (state = 'line', action) => {
  switch (action.type) {
    case 'UPDATE_GRAPH_FORM_TYPE': {
      return action.payload.graphType;
    }
    default:
      return state;
  }
};

const GraphGroup = (state = 'longitudinal', action) => {
  switch (action.type) {
    case 'UPDATE_GRAPH_FORM_TYPE': {
      return action.payload.graphGroup;
    }
    default:
      return state;
  }
};

const AppStatus = (state = {}, action) => {
  switch (action.type) {
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
      };
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
      };
    case 'formLongitudinal/COMPOSE_GRAPH_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Success'),
      };
    case 'EVENT_TYPE_REQUEST':
      return {
        status: 'loading',
        message: i18n.t('Fetching data...'),
      };
    case 'HIDE_APP_STATUS':
      return {
        status: null,
      };
    default:
      return state;
  }
};

const DashboardSelectorModal = (state = {}, action) => {
  switch (action.type) {
    case 'SELECT_DASHBOARD':
      return Object.assign({}, state, {
        selectedDashboard: action.payload.selectedDashboard,
      });
    case 'CLOSE_DASHBOARD_SELECTOR_MODAL':
      return Object.assign({}, state, { isOpen: false });
    case 'OPEN_DASHBOARD_SELECTOR_MODAL':
      return Object.assign({}, state, { isOpen: true });
    default:
      return state;
  }
};

const RenameGraphModal = (state = {}, action) => {
  switch (action.type) {
    case 'ON_RENAME_VALUE_CHANGE':
      return Object.assign({}, state, {
        updatedGraphTitle: action.payload.value,
      });
    case 'CLOSE_RENAME_GRAPH_MODAL':
      return Object.assign({}, state, {
        isOpen: false,
        updatedGraphTitle: null,
      });
    case 'OPEN_RENAME_GRAPH_MODAL':
      return Object.assign({}, state, { isOpen: true });
    case 'CONFIRM_RENAME_GRAPH':
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

const StaticData = (state = false, action) => {
  switch (action.type) {
    case 'UPDATE_CODING_SYSTEM_CATEGORY_SELECTIONS': {
      const {
        injuryPathologies,
        illnessPathologies,
        injuryClassifications,
        illnessClassifications,
        injuryBodyAreas,
        illnessBodyAreas,
      } = action.payload;
      return {
        ...state,
        injuryPathologies,
        illnessPathologies,
        injuryClassifications,
        illnessClassifications,
        injuryBodyAreas,
        illnessBodyAreas,
      };
    }
    default:
      return state;
  }
};

export {
  GraphGroup,
  GraphFormType,
  AppStatus,
  DashboardSelectorModal,
  RenameGraphModal,
  StaticData,
};
