// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ContactRole } from '@kitman/modules/src/Contacts/shared/types';

export const GET_CONTACT_ROLES_URL = '/planning_hub/game_contact_roles';

const getContactRoles = async (): Promise<Array<ContactRole>> => {
  const { data } = await axios.get(GET_CONTACT_ROLES_URL);
  return data;
};

export default getContactRoles;
