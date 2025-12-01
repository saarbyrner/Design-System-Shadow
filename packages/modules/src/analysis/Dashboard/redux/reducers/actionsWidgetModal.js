/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import _cloneDeep from 'lodash/cloneDeep';
import { emptySquadAthletes } from '../../components/utils';

export default (state = {}, action) => {
  switch (action.type) {
    case 'OPEN_ACTIONS_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: true,
        widgetId: action.payload.widgetId,
        organisation_annotation_type_ids: action.payload.annotationTypes,
        population: action.payload.population,
        hidden_columns: action.payload.hiddenColumns,
      };
    }
    case 'CLOSE_ACTIONS_WIDGET_MODAL': {
      return {
        ...state,
        isOpen: false,
        widgetId: null,
        organisation_annotation_type_ids: [],
        population: _cloneDeep(emptySquadAthletes),
        hidden_columns: [],
      };
    }
    case 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE': {
      return {
        ...state,
        organisation_annotation_type_ids: [
          ...state.organisation_annotation_type_ids,
          action.payload.annotationTypeId,
        ],
      };
    }
    case 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE': {
      return {
        ...state,
        organisation_annotation_type_ids:
          state.organisation_annotation_type_ids.filter(
            (selectedType) => selectedType !== action.payload.annotationTypeId
          ),
      };
    }
    case 'SET_ACTIONS_WIDGET_POPULATION': {
      return {
        ...state,
        population: action.payload.population,
      };
    }
    case 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS': {
      return {
        ...state,
        hidden_columns: action.payload.hiddenColumns,
      };
    }
    case 'SAVE_ACTIONS_WIDGET_SUCCESS': {
      return {
        ...state,
        status: null,
        isOpen: false,
      };
    }
    case 'SAVE_ACTIONS_WIDGET_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'SAVE_ACTIONS_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'CLOSE_ACTIONS_WIDGET_APP_STATUS': {
      return {
        ...state,
        status: null,
      };
    }
    default:
      return state;
  }
};
