import { axios } from '@kitman/common/src/utils/services';
import updateHomegrownSubmission from '../updateHomegrownSubmission';

const MOCK_PARAMS = {
  title: 'Title Change',
  date_submitted: '29/05/2025',
  certified_by: 'Bruno Fernandes',
  approval_document_id: 2,
  certified_document_id: 2,
};

describe('updateHomegrownSubmission', () => {
  let updateHomegrownSubmissionRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      updateHomegrownSubmissionRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() =>
          Promise.resolve({
            data: {
              message: 'Submission updated',
            },
          })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      await updateHomegrownSubmission(1, MOCK_PARAMS);

      expect(updateHomegrownSubmissionRequest).toHaveBeenCalledTimes(1);
      expect(updateHomegrownSubmissionRequest).toHaveBeenCalledWith(
        '/registration/homegrown/1',
        MOCK_PARAMS
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      updateHomegrownSubmissionRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(updateHomegrownSubmission(1, MOCK_PARAMS)).rejects.toThrow();
    });
  });
});
