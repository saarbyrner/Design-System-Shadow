import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_user_list';

import fetchUser from '../fetchUser';

describe('fetchUser', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchUser('645235245664daf0f8fccc44');

    expect(returnedData).toEqual(response.data[0]);
  });
});
