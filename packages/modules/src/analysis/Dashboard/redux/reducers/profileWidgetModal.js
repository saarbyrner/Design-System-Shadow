/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_PROFILE_WIDGET_MODAL': {
      return {
        ...state,
        open: true,
        widgetId: action.payload.widgetId,
        athlete_id: action.payload.athleteId,
        avatar_availability: action.payload.showAvailabilityIndicator,
        avatar_squad_number: action.payload.showSquadNumber,
        fields: action.payload.selectedInfoFields,
        backgroundColour: action.payload.backgroundColour,
      };
    }
    case 'CLOSE_PROFILE_WIDGET_MODAL': {
      return {
        ...state,
        open: false,
      };
    }
    case 'SELECT_ATHLETE': {
      return {
        ...state,
        athlete_id: action.payload.athleteId,
      };
    }
    case 'SELECT_WIDGET_INFO_ITEM': {
      return {
        ...state,
        fields: state.fields.map((field, index) => {
          if (index === action.payload.index) {
            return {
              ...field,
              name:
                action.payload.itemId === null ? 'none' : action.payload.itemId,
            };
          }
          return field;
        }),
      };
    }
    case 'SET_AVATAR_AVAILABILITY': {
      return {
        ...state,
        avatar_availability: action.payload.showAvailabilityIndicator,
      };
    }
    case 'SET_AVATAR_SQUAD_NUMBER': {
      return {
        ...state,
        avatar_squad_number: action.payload.showSquadNumber,
      };
    }
    case 'SAVE_PROFILE_WIDGET_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'SAVE_PROFILE_WIDGET_SUCCESS': {
      return {
        ...state,
        open: false,
        status: null,
      };
    }
    case 'SAVE_PROFILE_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'EDIT_PROFILE_WIDGET_SUCCESS': {
      return {
        ...state,
        open: false,
        status: null,
      };
    }
    case 'EDIT_PROFILE_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'UPDATE_PREVIEW_SUCCESS': {
      return {
        ...state,
        preview: {
          ...action.payload.widget,
        },
      };
    }

    case 'SET_PROFILE_BACKGROUND_COLOUR': {
      return {
        ...state,
        backgroundColour: action.payload.backgroundColour,
      };
    }

    default:
      return state;
  }
}
