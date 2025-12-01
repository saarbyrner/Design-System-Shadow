import { axios } from '@kitman/common/src/utils/services';
import archiveHomegrownSubmission from '../archiveHomegrownSubmission';

jest.mock('@kitman/common/src/utils/services');

const response = {
  message: 'Submission archived',
};

describe('archiveHomegrownSubmission', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'put').mockImplementation(() => {
      return Promise.resolve({
        data: response,
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should call the correct endpoint with the correct params', async () => {
    const result = await archiveHomegrownSubmission(1);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });
});
