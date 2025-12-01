/* eslint-disable flowtype/require-valid-file-annotation */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_DUPLICATE_DASHBOARD_MODAL': {
      return {
        ...state,
        dashboardName: action.payload.dashboardName,
        isOpen: true,
      };
    }
    case 'CHANGE_DUPLICATE_DASHBOARD_NAME': {
      return {
        ...state,
        dashboardName: action.payload.dashboardName,
      };
    }
    case 'CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD': {
      return {
        ...state,
        selectedSquad: action.payload.selectedSquad,
      };
    }
    case 'CLOSE_DUPLICATE_DASHBOARD_APP_STATUS': {
      return {
        ...state,
        status: null,
      };
    }
    case 'CLOSE_DUPLICATE_DASHBOARD_MODAL': {
      return {
        ...state,
        dashboardName: '',
        isOpen: false,
        status: null,
      };
    }
    case 'DUPLICATE_DASHBOARD_LOADING': {
      return {
        ...state,
        isOpen: false,
        status: 'loading',
      };
    }
    case 'DUPLICATE_DASHBOARD_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: 'success',
      };
    }
    case 'DUPLICATE_DASHBOARD_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    default:
      return state;
  }
}
