/* eslint-disable flowtype/require-valid-file-annotation */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_DUPLICATE_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: true,
        widgetId: action.payload.widgetId,
        widgetType: action.payload.widgetType,
        isNameEditable: action.payload.isNameEditable,
        widgetName: action.payload.widgetName,
      };
    }
    case 'CHANGE_SELECTED_DASHBOARD': {
      return {
        ...state,
        selectedDashboard: action.payload.selectedDashboard,
      };
    }
    case 'CHANGE_SELECTED_SQUAD': {
      return {
        ...state,
        selectedSquad: action.payload.selectedSquad,
      };
    }
    case 'CHANGE_DUPLICATE_WIDGET_NAME': {
      return {
        ...state,
        widgetName: action.payload.widgetName,
      };
    }
    case 'CLOSE_DUPLICATE_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: false,
        selectedDashboard: action.payload.activeDashboard,
        status: null,
        widgetId: null,
        widgetName: '',
        widgetType: '',
      };
    }
    case 'DUPLICATE_WIDGET_LOADING': {
      return {
        ...state,
        isOpen: false,
        status: 'loading',
      };
    }
    case 'DUPLICATE_WIDGET_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: 'success',
      };
    }
    case 'DUPLICATE_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'CLOSE_DUPLICATE_WIDGET_APP_STATUS': {
      return {
        ...state,
        status: null,
      };
    }
    default:
      return state;
  }
}
