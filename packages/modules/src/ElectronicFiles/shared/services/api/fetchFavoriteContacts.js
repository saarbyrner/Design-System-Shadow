// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExistingContact } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/contacts/user_favorites';

const fetchFavoriteContacts = async (): Promise<Array<ExistingContact>> => {
  const { data } = await axios.get(endpoint);

  return data;
};

export default fetchFavoriteContacts;
