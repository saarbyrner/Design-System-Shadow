/* eslint-disable flowtype/require-valid-file-annotation */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_PRINT_BUILDER': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_PRINT_BUILDER': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
}
