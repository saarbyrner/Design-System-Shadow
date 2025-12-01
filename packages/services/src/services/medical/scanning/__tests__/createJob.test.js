// flow
import { axios } from '@kitman/common/src/utils/services';
import { createJobData } from '@kitman/services/src/mocks/handlers/medical/scanning/handlers';
import createJob, {
  jobsUrl,
} from '@kitman/services/src/services/medical/scanning/createJob';

describe('createJob', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createJob();
    expect(returnedData).toEqual(createJobData);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await createJob();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(jobsUrl);
    });
  });
});
