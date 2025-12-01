import { data } from '../mocks/data/mock_scout_list';

import createScout from '../api/createScout';

describe('createScout', () => {
  const createdScout = data[0];
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createScout(createdScout);

    expect(returnedData).toEqual(data[0]);
  });
});
