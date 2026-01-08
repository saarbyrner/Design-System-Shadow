import { getNextSortingOrder } from '../utils';

describe('getNextSortingOrder', () => {
  it('returns a descending order on the new column when sorting on another column', () => {
    expect(
      getNextSortingOrder('columns_1', { column: 'columns_2', order: null })
    ).toEqual({ column: 'columns_1', order: 'DESCENDING' });
  });

  it('returns a descending order if there is no current order', () => {
    expect(
      getNextSortingOrder('columns_1', { column: 'columns_1', order: null })
    ).toEqual({ column: 'columns_1', order: 'DESCENDING' });
  });

  it('returns a ascending order if the current order is descending', () => {
    expect(
      getNextSortingOrder('columns_1', {
        column: 'columns_1',
        order: 'DESCENDING',
      })
    ).toEqual({ column: 'columns_1', order: 'ASCENDING' });
  });

  it('returns no order if the current order is ascending', () => {
    expect(
      getNextSortingOrder('columns_1', {
        column: 'columns_1',
        order: 'ASCENDING',
      })
    ).toEqual({ column: null, order: null });
  });
});
