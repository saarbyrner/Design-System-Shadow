import { response } from '../mocks/data/mock_additional_users_list';

import searchAdditionalUsers from '../api/searchAdditionalUsers';

describe('searchAdditionalUsers', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchAdditionalUsers();

    expect(returnedData.data).toEqual(response.data);
    expect(returnedData.meta).toEqual(response.meta);
  });
});
