/* eslint-disable camelcase */
// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<Store, 'commentsGrid'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'FETCH_COMMENTS_GRID_SUCCESS': {
      return {
        ...state,
        rows: [...state.rows, ...action.payload.grid.rows],
        next_id: action.payload.grid.next_id,
      };
    }

    case 'UPDATE_COMMENT': {
      const availability_comment = action.payload.comment;
      const rowId = action.payload.rowId;

      if (!state.rows?.length) {
        return state;
      }

      const commentsGrid = state.rows;

      const foundRowIndex = [...commentsGrid].findIndex(
        (row) => row.id === rowId
      );
      let foundRow;

      if (foundRowIndex !== -1) {
        foundRow = commentsGrid[foundRowIndex];
      }
      if (foundRow) {
        const updatedRow = { ...foundRow, availability_comment };

        return {
          ...state,
          rows: [
            ...commentsGrid.slice(0, foundRowIndex),
            updatedRow,
            ...commentsGrid.slice(foundRowIndex + 1),
          ],
        };
      }

      return state;
    }

    case 'RESET_COMMENTS_GRID': {
      return {
        ...state,
        next_id: null,
        rows: [],
      };
    }
    default:
      return state;
  }
};
