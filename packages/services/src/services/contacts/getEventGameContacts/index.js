// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  GameContactRole,
  GameContact,
} from '@kitman/services/src/services/contacts/updateGamedayRoles';

type GetEventGameContactsPayload = {
  eventId: number,
};

export type EventGameContact = {
  id: number,
  game_contact_role_id: number,
  game_contact_role: GameContactRole,
  game_contact_id: number,
  game_contact: GameContact,
  order: number,
};

export type Response = Array<EventGameContact>;

const getEventGameContacts = async ({
  eventId,
}: GetEventGameContactsPayload): Promise<Response> => {
  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/event_game_contacts`
  );
  return data;
};

export default getEventGameContacts;
