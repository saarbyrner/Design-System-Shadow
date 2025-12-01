// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Response } from '@kitman/services/src/services/contacts/getEventGameContacts';

type UpdateGamedayRolesArgs = {
  eventId: number,
  updates: Array<{
    id: number | null,
    game_contact_role_id?: number,
    game_contact_id?: number,
    destroy?: boolean,
  }>,
};

export type GameContactRole = {
  id: number,
  name: string,
  gameday_role: string,
  gameday_role_kind: string,
  gameday_role_order: number,
};

export type GameContact = {
  id: number,
  name: string,
  email: string,
  phone_number: string,
  dmn: boolean,
  dmr: boolean,
};

const updateGamedayRoles = async ({
  eventId,
  updates,
}: UpdateGamedayRolesArgs): Promise<Response> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/event_game_contacts/bulk_save`,
    {
      event_game_contacts: updates,
    }
  );

  return data;
};

export default updateGamedayRoles;
