import { axios } from '@kitman/common/src/utils/services';
import { defaultFilters } from '@kitman/modules/src/Contacts/shared/constants';
import searchContacts, {
  SEARCH_CONTACTS_URL,
  defaultSearchContactsPayload,
} from '..';
import mock from '../mock';

describe('searchContacts', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post');

    const data = await searchContacts(defaultFilters);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
      ...defaultSearchContactsPayload,
    });
    expect(data).toEqual(mock);
  });
});
