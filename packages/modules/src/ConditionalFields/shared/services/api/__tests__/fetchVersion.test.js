import { response } from '../../mocks/data/mock_version';

import fetchVersion from '../fetchVersion';

describe('fetchVersion', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchVersion({ rulesetId: 58, versionId: 1 });
    expect(returnedData).toEqual(response.data);
  });
});
