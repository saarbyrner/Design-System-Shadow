import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';

import fetchOrganisation from '../fetchOrganisation';

describe('fetchOrganisation', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchOrganisation(115);

    expect(returnedData).toEqual(response.data[0]);
  });
});
