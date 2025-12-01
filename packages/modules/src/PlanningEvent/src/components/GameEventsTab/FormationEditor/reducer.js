// @flow
import {
  initialState,
  type InitialState,
} from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  Formation,
  UpdatePosition,
  Field,
  FormationCoordinates,
} from '@kitman/common/src/types/PitchView';

export const actionTypes = {
  SET_FIELD: 'SET_FIELD',
  SET_SELECTED_GAME_FORMAT: 'SET_SELECTED_GAME_FORMAT',
  SET_SELECTED_FORMATION: 'SET_SELECTED_FORMATION',
  SET_FORMATION_COORDINATES: 'SET_FORMATION_COORDINATES',
  SET_FORMATION_COORDINATES_COPY: 'SET_FORMATION_COORDINATES_COPY',
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_FORMATIONS_GROUPED_BY_GAME_FORMAT:
    'SET_FORMATIONS_GROUPED_BY_GAME_FORMAT',
  SET_ACTIVE_COORDINATE_ID: 'SET_ACTIVE_COORDINATE_ID',
  SET_HIGHLIGHT_POSITION_ID: 'SET_HIGHLIGHT_POSITION_ID',
  SET_UPDATE_LIST: 'SET_UPDATE_LIST',
  SET_IS_SAVING_FORMATION: 'SET_IS_SAVING_FORMATION',
};

type Action =
  | {
      type: 'SET_FIELD',
      payload: Field,
    }
  | {
      type: 'SET_SELECTED_GAME_FORMAT',
      payload: OrganisationFormat,
    }
  | {
      type: 'SET_SELECTED_FORMATION',
      payload: Formation,
    }
  | {
      type: 'SET_FORMATION_COORDINATES',
      payload: FormationCoordinates,
    }
  | {
      type: 'SET_FORMATION_COORDINATES_COPY',
      payload: FormationCoordinates,
    }
  | {
      type: 'SET_IS_LOADING',
      payload: boolean,
    }
  | {
      type: 'SET_FORMATIONS_GROUPED_BY_GAME_FORMAT',
      payload: { [key: number]: Array<Formation> },
    }
  | {
      type: 'SET_ACTIVE_COORDINATE_ID',
      payload?: string,
    }
  | {
      type: 'SET_HIGHLIGHT_POSITION_ID',
      payload?: number,
    }
  | {
      type: 'SET_UPDATE_LIST',
      payload: {
        undo: Array<UpdatePosition>,
        redo: Array<UpdatePosition>,
      },
    }
  | {
      type: 'SET_IS_SAVING_FORMATION',
      payload: boolean,
    };

const reducer = (state: InitialState = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return { ...state, field: { ...state.field, ...action.payload } };
    case actionTypes.SET_SELECTED_GAME_FORMAT:
      return { ...state, selectedGameFormat: action.payload };
    case actionTypes.SET_SELECTED_FORMATION:
      return { ...state, selectedFormation: action.payload };
    case actionTypes.SET_FORMATION_COORDINATES:
      return {
        ...state,
        formationCoordinates: action.payload,
      };
    case actionTypes.SET_FORMATION_COORDINATES_COPY:
      return {
        ...state,
        formationCoordinatesCopy: action.payload,
      };
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_FORMATIONS_GROUPED_BY_GAME_FORMAT:
      return {
        ...state,
        formationsGroupedByGameFormat: action.payload,
      };
    case actionTypes.SET_ACTIVE_COORDINATE_ID:
      return { ...state, activeCoordinateId: action.payload };
    case actionTypes.SET_HIGHLIGHT_POSITION_ID:
      return { ...state, highlightPositionId: action.payload };
    case actionTypes.SET_UPDATE_LIST:
      return { ...state, updateList: action.payload };
    case actionTypes.SET_IS_SAVING_FORMATION:
      return { ...state, isSavingFormation: action.payload };
    default:
      return state;
  }
};

export default reducer;
