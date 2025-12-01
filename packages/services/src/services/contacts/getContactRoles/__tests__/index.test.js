import { axios } from '@kitman/common/src/utils/services';
import getContactRoles, { GET_CONTACT_ROLES_URL } from '..';
import mock from '../mock';

describe('getContactRoles', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const data = await getContactRoles();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(GET_CONTACT_ROLES_URL);
    expect(data).toEqual(mock);
  });
});
