import { response } from '../../mocks/data/mock_versions_list';

import fetchVersions from '../fetchVersions';

describe('fetchVersions', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchVersions(36);
    expect(returnedData).toEqual(response.data);
  });
});
