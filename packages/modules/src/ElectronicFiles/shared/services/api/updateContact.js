// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExistingContact } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const generateEndpointUrl = (id: number) => `/efax/contacts/${id}`;

const createContact = async (
  contact: ExistingContact
): Promise<ExistingContact> => {
  const { data } = await axios.put(generateEndpointUrl(contact.id), contact);

  return data;
};

export default createContact;
