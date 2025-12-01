import { response } from '../mocks/data/mock_squad_list';

import fetchSquad from '../fetchSquad';

describe('fetchSquad', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchSquad('645235245664daf0f8fccc44');

    expect(returnedData).toEqual(response.data[0]);
  });
});
