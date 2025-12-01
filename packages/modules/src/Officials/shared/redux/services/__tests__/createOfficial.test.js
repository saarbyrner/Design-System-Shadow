import { data } from '../mocks/data/mock_official_list';

import createOfficial from '../api/createOfficial';

describe('createOfficial', () => {
  const createdOfficial = {
    firstname: data[0].firstname,
    lastname: data[0].lastname,
    email: data[0].email,
    date_of_birth: data[0].date_of_birth,
    is_active: true,
  };
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createOfficial(createdOfficial);

    expect(returnedData).toEqual(createdOfficial);
  });
});
