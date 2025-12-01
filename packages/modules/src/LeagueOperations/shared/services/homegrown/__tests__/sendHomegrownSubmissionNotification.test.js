import { axios } from '@kitman/common/src/utils/services';
import sendHomegrownSubmissionNotification from '../sendHomegrownSubmissionNotification';

jest.mock('@kitman/common/src/utils/services');

const response = {
  message: 'Notification sent',
};

describe('sendHomegrownSubmissionNotification', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'post').mockImplementation(() => {
      return Promise.resolve({
        data: response,
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should call the correct endpoint with the correct params', async () => {
    const result = await sendHomegrownSubmissionNotification(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });
});
