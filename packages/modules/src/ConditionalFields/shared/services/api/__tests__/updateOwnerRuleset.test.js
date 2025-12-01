import { axios } from '@kitman/common/src/utils/services';

import { response } from '../../mocks/data/mock_ruleset_new-name';
import updateOwnerRuleset from '../updateOwnerRuleset';

describe('updateOwnerRuleset', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      const rulesetId = 42;
      await updateOwnerRuleset({ rulesetId, name: 'New ruleset name' });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/conditional_fields/rulesets/${rulesetId}`,
        { name: 'New ruleset name' }
      );
    });
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateOwnerRuleset({
      rulesetId: 42,
      name: 'New ruleset name',
    });

    expect(returnedData).toEqual(response.data);
  });
});
