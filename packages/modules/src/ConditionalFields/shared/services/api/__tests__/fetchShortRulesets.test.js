import { response } from '../../mocks/data/mock_short_rulesets_list';

import fetchShortRulesets from '../fetchShortRulesets';

describe('fetchShortRulesets', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchShortRulesets();
    expect(returnedData).toEqual(response.data);
  });
});
