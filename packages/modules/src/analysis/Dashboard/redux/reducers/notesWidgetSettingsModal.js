/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_NOTES_WIDGET_SETTINGS_MODAL': {
      return {
        ...state,
        isOpen: true,
        widgetId: action.payload.widgetId,
        widgetName: action.payload.widgetName,
        widget_annotation_types: action.payload.annotationTypes,
        population: action.payload.population,
        time_scope: action.payload.timeScope,
      };
    }
    case 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'SET_NOTES_WIDGET_SETTINGS_POPULATION': {
      return {
        ...state,
        population: action.payload.population,
      };
    }
    case 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD': {
      return {
        ...state,
        time_scope: {
          ...state.time_scope,
          time_period: action.payload.timePeriod,
        },
      };
    }
    case 'SELECT_ANNOTATION_TYPE': {
      return {
        ...state,
        widget_annotation_types: [
          ...state.widget_annotation_types,
          {
            organisation_annotation_type_id: action.payload.annotationTypeId,
          },
        ],
      };
    }
    case 'UNSELECT_ANNOTATION_TYPE': {
      return {
        ...state,
        widget_annotation_types: state.widget_annotation_types.filter(
          (selectedTypes) =>
            selectedTypes.organisation_annotation_type_id !==
            action.payload.annotationTypeId
        ),
      };
    }
    case 'UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE': {
      return {
        ...state,
        time_scope: {
          ...state.time_scope,
          start_time: action.payload.dateRange.start_date,
          end_time: action.payload.dateRange.end_date,
        },
      };
    }
    case 'UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH': {
      return {
        ...state,
        time_scope: {
          ...state.time_scope,
          time_period_length: action.payload.timePeriodLength,
        },
      };
    }
    case 'SAVE_NOTES_WIDGET_SETTINGS_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'SAVE_NOTES_WIDGET_SETTINGS_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: null,
      };
    }
    case 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'EDIT_NOTES_WIDGET_SETTINGS_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: null,
      };
    }
    case 'EDIT_NOTES_WIDGET_SETTINGS_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    default:
      return state;
  }
}
