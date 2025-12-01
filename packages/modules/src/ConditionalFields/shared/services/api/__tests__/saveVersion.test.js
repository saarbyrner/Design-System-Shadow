import { axios } from '@kitman/common/src/utils/services';
import { response as MOCK_VERSION } from '../../mocks/data/mock_version';
import saveVersion from '../saveVersion';

const MOCK_PAYLOAD_FOR_SAVE_VERSION = {
  rulesetId: 58,
  versionId: 1,
  conditions: MOCK_VERSION.conditions,
  name: MOCK_VERSION.name,
};
describe('saveVersion', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch').mockResolvedValueOnce({});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await saveVersion(MOCK_PAYLOAD_FOR_SAVE_VERSION);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1',
        { conditions: MOCK_VERSION.conditions, name: MOCK_VERSION.name }
      );
    });

    it('calls the correct body data with no conditions', async () => {
      await saveVersion({
        rulesetId: 58,
        versionId: 1,
        name: MOCK_VERSION.name,
        conditions: null,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1',
        { name: MOCK_VERSION.name }
      );
    });

    it('calls the correct body data with no name', async () => {
      await saveVersion({
        rulesetId: 58,
        versionId: 1,
        conditions: MOCK_VERSION.conditions,
        name: null,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1',
        { conditions: MOCK_VERSION.conditions }
      );
    });
  });
});
