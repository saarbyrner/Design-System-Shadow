import { data } from '../mocks/data/mock_scout_list';

import updateScout from '../api/updateScout';

describe('updateScout', () => {
  const updatedScout = {
    firstname: data[0].firstname,
    lastname: data[0].lastname,
    email: data[0].email,
    date_of_birth: data[0].date_of_birth,
    is_active: true,
    type: data[0].user_type,
  };
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateScout({
      id: 1,
      official: updatedScout,
    });

    expect(returnedData).toEqual(data[0]);
  });
});
