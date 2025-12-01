/* eslint-disable flowtype/require-valid-file-annotation */

export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_NOTE_DETAIL_MODAL': {
      return {
        ...state,
        isOpen: true,
        requestStatus: 'loading',
      };
    }
    case 'CLOSE_NOTE_DETAIL_MODAL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'FETCH_NOTE_DETAIL_SUCCESS': {
      return {
        ...state,
        annotation: action.payload.annotation,
        requestStatus: 'success',
      };
    }
    case 'FETCH_NOTE_DETAIL_ERROR': {
      return {
        ...state,
        requestStatus: 'error',
      };
    }
    default:
      return state;
  }
}
