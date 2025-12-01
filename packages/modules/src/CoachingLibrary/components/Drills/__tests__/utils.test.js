import getTableHeaderData from '../utils';

describe('getTableHeaderData', () => {
  const args = {
    t: (string) => string,
    numberOfSquads: 0,
    setViewedDrill: jest.fn(),
  };

  it('returns expected result', async () => {
    expect(getTableHeaderData(args)).toEqual([
      {
        key: 'checkbox',
        name: '',
        formatter: expect.any(Function),
        frozen: true,
        width: 45,
        minWidth: 45,
        maxWidth: 45,
      },
      {
        key: 'name',
        name: 'Drill name',
        formatter: expect.any(Function),
        resizable: true,
        width: 190,
      },
      {
        key: 'description',
        name: 'Description',
        formatter: expect.any(Function),
        resizable: true,
        width: 230,
      },
      {
        key: 'intensity',
        name: 'Intensity',
        formatter: expect.any(Function),
        resizable: true,
        width: 110,
      },
      {
        key: 'type',
        name: 'Activity type',
        formatter: expect.any(Function),
        resizable: true,
        width: 150,
      },
      {
        key: 'principles',
        name: 'Principle(s)',
        formatter: expect.any(Function),
        resizable: true,
        width: 150,
      },
      {
        key: 'creator',
        name: 'Creator',
        formatter: expect.any(Function),
        resizable: true,
        width: 150,
      },
      {
        key: 'squads',
        name: 'Squads',
        formatter: expect.any(Function),
        resizable: true,
        width: 'max-content',
      },
      {
        key: 'tooltip-menu',
        name: '',
        formatter: expect.any(Function),
        resizable: false,
        maxWidth: 48,
        minWidth: 48,
        width: 48,
      },
    ]);
  });
});
