import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_homegrown_list';

import searchHomegrownList from '../searchHomegrownList';

describe('searchHomegrownList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchHomegrownList({});
    expect(returnedData.data.length).toEqual(response.data.length);
  });
});
