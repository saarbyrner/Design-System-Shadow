// flow
import { axios } from '@kitman/common/src/utils/services';
import putFileToPresignedUrl from '@kitman/services/src/services/uploads/putFileToPresignedUrl';
import {
  mockUploadUrl,
  headers,
} from '@kitman/services/src/mocks/handlers/uploads/putFileToPresignedUrl.mock';

describe('putFileToPresignedUrl', () => {
  it('calls the correct endpoint without error', async () => {
    let errored = false;
    try {
      await putFileToPresignedUrl(
        { fileStandIn: 'notReallyAFile' },
        mockUploadUrl,
        headers
      );
    } catch {
      errored = true;
    }

    expect(errored).toEqual(false);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'put');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await putFileToPresignedUrl(
        { fileStandIn: 'notReallyAFile' },
        mockUploadUrl,
        headers
      );

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        mockUploadUrl,
        {
          fileStandIn: 'notReallyAFile',
        },
        { headers }
      );
    });
  });
});
