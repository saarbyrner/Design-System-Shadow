import { axios } from '@kitman/common/src/utils/services';
import createContact, { CREATE_CONTACT_URL } from '..';

describe('createContact', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post');

    const payload = {
      name: 'Gordon Morales',
      organisation_id: 1,
      game_contact_role_ids: [1],
      phone_number: '+4444444444',
      email: 'john@gmail.com',
      dmn: true,
      dmr: false,
      status: 'pending',
      tv_channel_id: 1,
    };

    const res = await createContact(payload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(CREATE_CONTACT_URL, {
      name: payload.name,
      organisation_id: payload.organisation_id,
      game_contact_role_ids: payload.game_contact_role_ids,
      phone_number: payload.phone_number,
      email: payload.email,
      dmn: payload.dmn,
      dmr: payload.dmr,
      status: payload.status,
      tv_channel_id: payload.tv_channel_id,
    });
    expect(res.status).toEqual(200);
  });
});
