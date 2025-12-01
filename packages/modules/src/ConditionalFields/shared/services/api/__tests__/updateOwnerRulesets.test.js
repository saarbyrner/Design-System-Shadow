import { axios } from '@kitman/common/src/utils/services';
import { response } from '../../mocks/data/mock_newly-created_ruleset';
import updateOwnerRulesets from '../updateOwnerRulesets';

describe('updateOwnerRulesets', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await updateOwnerRulesets();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(`/conditional_fields/rulesets`);
    });
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateOwnerRulesets();

    expect(returnedData).toEqual(response.data);
  });
});
