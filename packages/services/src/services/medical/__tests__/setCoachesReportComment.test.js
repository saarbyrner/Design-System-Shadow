import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/medical/setCoachesReportComment';
import setCoachesReportComment from '../setCoachesReportComment';

const requestParams = {
  athlete_id: 40211,
  comment: 'wooooo',
  comment_date: 'Jul 22, 2023',
};

jest.mock('@kitman/common/src/utils/services', () => {
  return {
    axios: {
      create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      })),
      post: jest.fn(),
    },
  };
});

describe('setCoachesReportComment', () => {
  let request;
  beforeEach(() => {
    request = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => resolve({ data }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with correct body data in the request', async () => {
    await setCoachesReportComment(requestParams);

    expect(request).toHaveBeenCalledWith(
      '/athletes/40211/availability_comments',
      requestParams
    );
  });

  it('receives correct data from endpoint', async () => {
    const returnedData = await setCoachesReportComment(requestParams);

    expect(request).toHaveBeenCalledWith(
      '/athletes/40211/availability_comments',
      requestParams
    );
    expect(returnedData.data).toEqual(data);
  });

  it('does not call the endpoint without an athlete id', async () => {
    // without athlete id
    const requestParamsNoId = { ...requestParams, athlete_id: null };
    await setCoachesReportComment(requestParamsNoId);

    expect(request).not.toHaveBeenCalledWith(
      '/athletes/40211/availability_comments',
      requestParamsNoId
    );
  });

  it('calls the endpoint with only an athleteID and a comment value (even an empty string)', async () => {
    const requestParamsNoComment = { athlete_id: 12345, comment: '' };
    await setCoachesReportComment(requestParamsNoComment);

    expect(request).toHaveBeenCalledWith(
      '/athletes/12345/availability_comments',
      requestParamsNoComment
    );
  });
});
