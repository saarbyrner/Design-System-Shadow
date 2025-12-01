// flow
import { axios } from '@kitman/common/src/utils/services';
import splitDocument, {
  generateSpecificJobUrl,
} from '@kitman/services/src/services/medical/scanning/splitDocument';
import mockSplitConfig from '@kitman/services/src/mocks/handlers/medical/scanning/splitConfig.mock';

describe('splitDocument', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    let errored = false;
    try {
      await splitDocument({
        jobId: 1,
        splitConfig: mockSplitConfig,
      });
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
      await splitDocument({ jobId: 1, splitConfig: mockSplitConfig });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        generateSpecificJobUrl(1),
        mockSplitConfig
      );
    });
  });
});
