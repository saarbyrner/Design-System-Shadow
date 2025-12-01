import { response } from '../mocks/data/mock_squad_list';

import searchSquadList from '../searchSquadList';

describe('searchSquadList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchSquadList({});

    expect(returnedData.data.length).toEqual(response.data.length);
  });
});
