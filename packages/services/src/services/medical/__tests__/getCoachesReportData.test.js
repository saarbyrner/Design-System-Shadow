import { axios } from '@kitman/common/src/utils/services';
import { mockData } from '@kitman/services/src/mocks/handlers/medical/getCoachesReportData';
import getCoachesReportData from '../getCoachesReportData';

jest.mock('@kitman/common/src/utils/services', () => ({
  ...jest.requireActual('@kitman/common/src/utils/services'),
  axios: {
    ...jest.requireActual('@kitman/common/src/utils/services').axios,
    post: jest.fn(() => Promise.resolve({ data: { ...mockData } })),
  },
}));

describe('getCoachesReportData', () => {
  const payload = {
    next_id: 0,
    filters: {
      athlete_name: 'john jones',
      report_date: '2024-05-15T12:02:51.217Z',
      positions: 'string',
      squads: [8],
      availabilities: [],
      issues: [],
    },
  };

  it('returns the correct comment data', async () => {
    const result = await getCoachesReportData(payload);
    const allRows = result.rows;

    allRows.forEach((row) => {
      expect(row.availability_comment).toBeTruthy();
    });
    expect(result.rows[0].availability_comment).toEqual('This is a comment');
    expect(result.rows[1].availability_comment).toEqual(
      'This is a comment on Janets info'
    );
  });
});

describe('Mock axios', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => resolve({ data: { ...mockData } }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const payload = {
    next_id: null,
    filters: {
      athlete_name: 'Ted',
      report_date: '2024-05-15T12:02:51.217Z',
      positions: [],
      squads: [8],
      availabilities: [],
      issues: [],
    },
  };

  it('calls the correct endpoint with correct body data in the request', async () => {
    await getCoachesReportData({
      ...payload,
    });

    expect(request).toHaveBeenCalledWith('/medical/coaches/fetch', {
      next_id: null,
      filters: {
        athlete_name: 'Ted',
        report_date: '2024-05-15T12:02:51.217Z',
        positions: [],
        squads: [8],
        availabilities: [],
        issues: [],
      },
    });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('uses default values in serice when values not passed', async () => {
    await getCoachesReportData();

    expect(request).toHaveBeenCalledWith('/medical/coaches/fetch', {
      next_id: 0,
      filters: {
        athlete_name: 'string',
        date: 'string',
        report_date: 'string',
        positions: [],
        squads: [],
        availabilities: [],
        issues: [],
      },
    });
    expect(request).toHaveBeenCalledTimes(1);
  });
});
