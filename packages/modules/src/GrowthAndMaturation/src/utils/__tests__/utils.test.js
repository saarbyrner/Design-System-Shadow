import { getColumns, getRows } from '../index';

describe('utils', () => {
  it('getRows', () => {
    const mockSubmissionsSubmitted = {
      growth_and_maturation: 17,
      baselines: 0,
    };
    const mockLastEdited = {
      growth_and_maturation: {
        date: 'Oct 30, 2024 11:02 AM',
        by: 'Dan Higgins-admin-eu',
      },
      baselines: {
        date: null,
        by: null,
      },
    };

    expect(getRows(mockSubmissionsSubmitted, mockLastEdited)).toMatchSnapshot();
  });

  it('getColumns', () => {
    expect(getColumns()).toMatchSnapshot();
  });
});
