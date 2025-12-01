// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ContactResponse } from '@kitman/modules/src/Contacts/shared/types';
import { GAME_CONTACTS } from '../updateContact';

type DeletePayload = {
  id: number,
  archived: boolean,
};

const deleteContact = async ({
  id,
  archived,
}: DeletePayload): Promise<ContactResponse> => {
  const { data } = await axios.patch(`${GAME_CONTACTS}/${id}`, { archived });

  return data;
};

export default deleteContact;
