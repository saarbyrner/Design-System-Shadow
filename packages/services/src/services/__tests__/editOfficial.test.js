import { data } from '../../mocks/handlers/createOfficial';
import editOfficial from '../editOfficial';

describe('editOfficial', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await editOfficial({
      firstname: 'Official',
      lastname: '1',
      email: 'official1@email.com',
      date_of_birth: '1998-08-09',
      is_active: true,
    });

    expect(returnedData).toEqual(data);
  });
});
