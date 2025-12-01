import { axios } from '@kitman/common/src/utils/services';
import { response } from '../../mocks/data/mock_version';
import publishVersion from '../publishVersion';

describe('publishVersion', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await publishVersion({ rulesetId: 58, versionId: 1 });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1/publish'
      );
    });
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await publishVersion({ rulesetId: 58, versionId: 1 });

    expect(returnedData).toEqual(response.data);
  });
});
