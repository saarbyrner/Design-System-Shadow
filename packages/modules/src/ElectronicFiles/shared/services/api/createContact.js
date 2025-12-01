// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  NewContact,
  ExistingContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/contacts';

const createContact = async (contact: NewContact): Promise<ExistingContact> => {
  const { data } = await axios.post(endpoint, contact);

  return data;
};

export default createContact;
