import {
  getCellHeaders,
  getEmptyTableText,
  convertPositionsToOptions,
} from '../utils';

// Duplication of tests, but I'm waiting on spec as the results will differ depending on the organisation level
describe('getCellHeaders', () => {
  describe('at an association level', () => {
    it('returns the correct headers', () => {
      const result = getCellHeaders(true);
      expect(result).toHaveLength(8);

      expect(result[0].id).toEqual('name');
      expect(result[1].id).toEqual('assigned_to');
      expect(result[2].id).toEqual('email');
      expect(result[3].id).toEqual('date_of_birth');
      expect(result[4].id).toEqual('id');
      expect(result[5].id).toEqual('username');
      expect(result[6].id).toEqual('position');
      expect(result[7].id).toEqual('career_status');
    });
  });
  describe('at an organisation level', () => {
    it('returns the correct headers', () => {
      const result = getCellHeaders(false);
      expect(result).toHaveLength(5);

      expect(result[0].id).toEqual('name');
      expect(result[1].id).toEqual('username');
      expect(result[2].id).toEqual('position');
      expect(result[3].id).toEqual('squads');
      expect(result[4].id).toEqual('creation_date');
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the filter is empty', () => {
    expect(getEmptyTableText({ search_expression: '' })).toEqual(
      'No released athletes found'
    );
  });
  it('show the correct text when the table is filtered', () => {
    expect(getEmptyTableText({ search_expression: 'search term' })).toEqual(
      'No athletes match the search criteria'
    );
  });
});

describe('convertPositionsToOptions', () => {
  it('converts positions to options correctly', () => {
    const positions = [
      {
        id: 28,
        name: 'Defender',
        order: 1,
        positions: [
          { id: 1, name: 'Position 1' },
          { id: 2, name: 'Position 2' },
        ],
      },
      {
        id: 29,
        name: 'Defender',
        order: 2,
        positions: [
          { id: 3, name: 'Position 3' },
          { id: 4, name: 'Position 4' },
        ],
      },
    ];

    const expectedOptions = [
      { value: 1, label: 'Position 1' },
      { value: 2, label: 'Position 2' },
      { value: 3, label: 'Position 3' },
      { value: 4, label: 'Position 4' },
    ];

    expect(convertPositionsToOptions(positions)).toEqual(expectedOptions);
  });

  it('returns an empty array when positions is null', () => {
    const positions = null;
    expect(convertPositionsToOptions(positions)).toEqual([]);
  });

  it('returns an empty array when positions is undefined', () => {
    const positions = undefined;
    expect(convertPositionsToOptions(positions)).toEqual([]);
  });

  it('returns an empty array when positions is an empty array', () => {
    const positions = [];
    expect(convertPositionsToOptions(positions)).toEqual([]);
  });
});
