/* eslint-disable camelcase */
// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'grid'> = {},
  action: Action
) {
  switch (action.type) {
    case 'SET_GRID_PAGINATION': {
      return {
        ...state,
        current_id: action.payload.currentId,
      };
    }

    case 'RESET_GRID_PAGINATION': {
      return {
        ...state,
        current_id: null,
      };
    }

    case 'FETCH_GRID_SUCCESS': {
      const { columns, rows, next_id } = action.payload.grid;

      return {
        ...state,
        columns,
        next_id,
        rows: action.payload.reset ? rows : [...state.rows, ...rows],
      };
    }

    case 'RESET_GRID': {
      return {
        ...state,
        next_id: null,
        columns: [],
        rows: [],
      };
    }
    default:
      return state;
  }
}
