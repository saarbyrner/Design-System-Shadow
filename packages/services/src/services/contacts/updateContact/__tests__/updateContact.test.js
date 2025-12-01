import { axios } from '@kitman/common/src/utils/services';
import updateContact, { GAME_CONTACTS } from '..';

describe('updateContact', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'patch');

    const payload = {
      id: 1,
      updates: {
        status: 'rejected',
        archived: true,
        status_description: 'not authorised',
      },
    };

    const res = await updateContact(payload);

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `${GAME_CONTACTS}/${payload.id}`,
      payload.updates
    );
    expect(res.status).toEqual(200);
  });
});
