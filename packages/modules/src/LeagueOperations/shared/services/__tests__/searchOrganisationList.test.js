import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';

import searchOrganisationList from '../searchOrganisationList';

describe('searchOrganisationList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchOrganisationList({});

    expect(returnedData.data.length).toEqual(response.data.length);
  });
});
