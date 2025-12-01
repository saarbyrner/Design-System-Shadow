import { data } from '../mocks/data/mock_additional_users_list';

import updateAdditionalUser from '../api/updateAdditionalUser';

describe('updateAdditionalUser', () => {
  const user = {
    firstname: data[0].firstname,
    lastname: data[0].lastname,
    email: data[0].email,
    date_of_birth: data[0].date_of_birth,
    is_active: true,
    type: data[0].user_type,
  };

  it('calls the correct update additional user endpoint and returns the correct value', async () => {
    const returnedData = await updateAdditionalUser({
      id: 1,
      user,
    });
    expect(returnedData).toEqual(data[0]);
  });
});
