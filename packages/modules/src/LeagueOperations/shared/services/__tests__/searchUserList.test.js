import { response } from '../mocks/data/mock_user_list';

import searchUserList from '../searchUserList';

describe('searchUserList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchUserList({});

    expect(returnedData.data.length).toEqual(response.data.length);
  });
});
