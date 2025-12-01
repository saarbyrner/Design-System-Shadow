import { data } from '../mocks/data/mock_additional_users_list';
import createAdditionalUser from '../api/createAdditionalUser';

describe('createAdditionalUser', () => {
  const user = data[0];
  it('calls the correct create additional user endpoint and returns the correct value', async () => {
    const returnedData = await createAdditionalUser(user);

    expect(returnedData).toEqual(data[0]);
  });
});
