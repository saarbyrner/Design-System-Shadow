// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ContactStatuses } from '@kitman/modules/src/Contacts/shared/types';

export type Updates = $Shape<{
  name: string,
  organisation_id: number,
  tv_channel_id: number | null,
  game_contact_role_ids: Array<number>,
  phone_number: string,
  email: string,
  dmn: boolean,
  dmr: boolean,
  status: ContactStatuses,
  archived: boolean,
  status_description: string,
}>;

type UpdatePayload = {
  id: number,
  updates: Updates,
};

export const GAME_CONTACTS = '/planning_hub/game_contacts';

const updateContact = async ({ id, updates }: UpdatePayload) => {
  return axios.patch(`${GAME_CONTACTS}/${id}`, updates);
};

export default updateContact;
