import { response } from '../mocks/data/mock_scout_list';

import searchScouts from '../api/searchScouts';

describe('searchScouts', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchScouts();

    expect(returnedData.data).toEqual(response.data);
    expect(returnedData.meta).toEqual(response.meta);
  });
});
