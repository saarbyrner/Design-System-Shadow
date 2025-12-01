/* eslint-disable flowtype/require-valid-file-annotation */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_TABLE_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_TABLE_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'ADD_TABLE_WIDGET_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: null,
      };
    }
    case 'ADD_TABLE_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'ADD_TABLE_WIDGET_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    default:
      return state;
  }
}
