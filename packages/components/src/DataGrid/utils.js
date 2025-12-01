// @flow
import type { GridSorting } from '.';

export const getNextSortingOrder = (
  column: string | number,
  gridSorting: GridSorting
) => {
  // If the user sorts a new column, use the first order (descending)
  if (column !== gridSorting.column) {
    return {
      column,
      order: 'DESCENDING',
    };
  }

  // Otherwise, the sort order is:
  // descending => ascending => no sorting
  switch (gridSorting.order) {
    case null:
      return {
        column,
        order: 'DESCENDING',
      };

    case 'DESCENDING':
      return {
        column,
        order: 'ASCENDING',
      };

    case 'ASCENDING':
    default:
      return {
        column: null,
        order: null,
      };
  }
};
