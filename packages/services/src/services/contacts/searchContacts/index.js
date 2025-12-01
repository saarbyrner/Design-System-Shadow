// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ContactResponse,
  ContactStatuses,
} from '@kitman/modules/src/Contacts/shared/types';

export type SearchPayload = $Shape<{
  search?: string,
  gameContactRoleIds?: Array<number>,
  statuses?: Array<ContactStatuses>,
  dmn: ?boolean, // null to include both dmn true and false
  dmr: ?boolean, // null to include both dmn true and false
  nextId: ?number,
  organisationIds?: Array<number>,
  tvChannelIds?: Array<number>,
  paginate?: boolean,
}>;

export type SearchResponse = {
  game_contacts: Array<ContactResponse>,
  next_id: ?number,
};

export const defaultSearchContactsPayload = {
  search_expression: '',
  game_contact_role_ids: [],
  statuses: [],
  dmn: null,
  dmr: null,
  next_id: null,
  organisation_ids: [],
  tv_channel_ids: [],
  paginate: true,
};

export const SEARCH_CONTACTS_URL = '/planning_hub/game_contacts/search';

const searchContacts = async (
  payload: SearchPayload = {}
): Promise<SearchResponse> => {
  const { data } = await axios.post(SEARCH_CONTACTS_URL, {
    search_expression: payload.search ?? '',
    game_contact_role_ids: payload.gameContactRoleIds ?? [],
    statuses: payload.statuses ?? [],
    dmn: payload.dmn ?? null,
    dmr: payload.dmr ?? null,
    next_id: payload.nextId ?? null,
    organisation_ids: payload.organisationIds ?? [],
    tv_channel_ids: payload.tvChannelIds ?? [],
    paginate: payload.paginate ?? true,
  });
  return data;
};

export default searchContacts;
