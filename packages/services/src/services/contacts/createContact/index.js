// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ContactStatuses } from '@kitman/modules/src/Contacts/shared/types';

export type CreatePayload = {
  name: string,
  organisation_id: number,
  game_contact_role_ids: Array<number>,
  phone_number: string,
  email: string,
  dmn: boolean,
  dmr: boolean,
  status: ContactStatuses,
  tv_channel_id: number | null,
};

export const CREATE_CONTACT_URL = '/planning_hub/game_contacts';

const createContact = async (payload: CreatePayload) => {
  return axios.post(CREATE_CONTACT_URL, payload);
};

export default createContact;
