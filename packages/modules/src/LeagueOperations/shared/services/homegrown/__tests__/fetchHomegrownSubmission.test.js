import { axios } from '@kitman/common/src/utils/services';
import {
  meta,
  data,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_homegrown_list';
import fetchHomegrownSubmission from '../fetchHomegrownSubmission';

jest.mock('@kitman/common/src/utils/services');

const response = {
  data: data[0],
  meta,
};

describe('fetchHomegrownSubmission', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: response,
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should call the correct endpoint with the correct params', async () => {
    const result = await fetchHomegrownSubmission(1);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });
});
