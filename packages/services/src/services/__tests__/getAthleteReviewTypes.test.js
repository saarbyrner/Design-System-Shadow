import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/getAthleteReviewTypes';
import getAthleteReviewTypes, {
  GENERIC_ATHLETES_REVIEW_ENDPOINT,
} from '@kitman/services/src/services/getAthleteReviewTypes';

describe('getAthleteReviewTypes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the getAthleteReviewTypes endpoint', async () => {
    const getAthleteReviewTypesRequest = jest.spyOn(axios, 'get');

    const returnedData = await getAthleteReviewTypes();

    expect(returnedData).toEqual(data);
    expect(getAthleteReviewTypesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteReviewTypesRequest).toHaveBeenCalledWith(
      GENERIC_ATHLETES_REVIEW_ENDPOINT
    );
  });

  it('calls the getAthleteReviewTypes endpoint - error response', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getAthleteReviewTypes();
    }).rejects.toThrow();
  });
});
