import { response } from '../../mocks/data/mock_division_list';

import searchOrganisationDivisionList from '../searchOrganisationDivisionList';

describe('searchOrganisationDivisionList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchOrganisationDivisionList({});

    expect(returnedData.length).toEqual(response.length);
  });
});
