import { response } from '../../mocks/data/mock_rulesets_list';

import fetchRulesets from '../fetchRulesets';

describe('fetchRulesets', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchRulesets();
    expect(returnedData).toEqual(response.data);
  });
});
