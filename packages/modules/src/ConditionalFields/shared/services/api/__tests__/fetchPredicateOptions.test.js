import { response } from '../../mocks/data/mock_predicate_options_list';

import fetchPredicateOptions from '../fetchPredicateOptions';

describe('fetchVersions', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchPredicateOptions(2);
    expect(returnedData).toEqual(response.data);
  });
});
