// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import type { GridRow } from '../../../types';

const defaultState = {
  columns: [],
  nextId: null,
  rows: [],
};

export default function (
  state: $PropertyType<Store, 'grid'> = defaultState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_GRID_SUCCESS': {
      // eslint-disable-next-line camelcase
      const { columns, rows, next_id } = action.payload.grid;

      return {
        ...state,
        columns,
        nextId: next_id,
        rows: action.payload.reset ? rows : [...state.rows, ...rows],
      };
    }
    case 'UPDATE_ATHLETE_COMMENTS': {
      const updatedRows: Array<GridRow> = state.rows.slice();
      const rowToUpdate =
        updatedRows.find(
          ({ athlete }) => athlete.id === action.payload.athleteId
        ) || {};

      action.payload.newComments.forEach((newComment) => {
        const assessmentItem =
          action.payload.assessmentItems.find(
            (item) => item.id === newComment.assessment_item_id
          ) || {};
        const rowAttributeToUpdate =
          rowToUpdate[assessmentItem.item.training_variable.perma_id];
        rowAttributeToUpdate.comment.content = newComment.value;
      });

      return {
        ...state,
        rows: updatedRows,
      };
    }
    case 'UPDATE_GRID': {
      // eslint-disable-next-line camelcase
      const { columns, rows, next_id } = action.payload.newGrid;

      return {
        ...state,
        columns,
        nextId: next_id,
        rows,
      };
    }
    case 'UPDATE_GRID_ROW': {
      const { attributes, rowId } = action.payload;
      const currentRows = state.rows.slice();
      const rowToUpdate = currentRows.find(({ athlete }) => {
        return athlete.id === rowId;
      });
      const updatedRow = { ...rowToUpdate, ...attributes };

      if (updatedRow.rpe && updatedRow.minutes) {
        updatedRow.load = updatedRow.rpe * updatedRow.minutes;
      }
      const updatedRows: Array<GridRow> = currentRows.map((row) => {
        if (row.athlete.id === rowId || row.id === rowId) {
          return updatedRow;
        }
        return row;
      });

      return {
        ...state,
        rows: updatedRows,
      };
    }
    case 'RESET_GRID': {
      // eslint-disable-next-line camelcase
      const { columns, rows, next_id } = action.payload.grid;

      return {
        ...state,
        columns,
        nextId: next_id,
        rows,
      };
    }
    default:
      return state;
  }
}
