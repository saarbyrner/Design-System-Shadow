import { response } from '../mocks/data/mock_official_list';

import searchOfficials from '../api/searchOfficials';

describe('searchOfficials', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchOfficials();

    expect(returnedData.data).toEqual(response.data);
    expect(returnedData.meta).toEqual(response.meta);
  });
});
