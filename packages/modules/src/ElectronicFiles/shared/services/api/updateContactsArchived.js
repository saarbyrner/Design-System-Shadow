// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExistingContact } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/contacts/archive';

export type RequestResponse = Array<ExistingContact>;

const updateContactArchived = async ({
  archived,
  contactIds,
}: {
  archived: boolean,
  contactIds: Array<number>,
}): Promise<RequestResponse> => {
  const { data } = await axios.patch(endpoint, {
    archived,
    contact_ids: contactIds,
  });

  return data;
};

export default updateContactArchived;
