// @flow
import { mailingList, contactStatuses } from './constants';

export type MailingList = $Values<typeof mailingList>;

export type ContactStatuses = $Values<typeof contactStatuses>;

export type ContactRole = {
  id: number,
  name: string,
  gameday_role: 'optional' | 'required',
  gameday_role_kind: 'league_contact' | 'home_contact' | 'away_contact',
  gameday_role_order: number,
};

type ContactOrganisation = {
  id: number,
  name: string,
  logo_full_path: ?string,
};

export type Contact = {
  name: string,
  organisation: ContactOrganisation | null,
  gameContactRoles: Array<ContactRole>,
  phone: string,
  email: string,
  dmn: boolean,
  dmr: boolean,
  status: ContactStatuses,
  statusDescription?: string,
  tvChannelId: number | null,
};

export type ContactWithId = Contact & {
  id: number,
};

export type ContactResponse = {
  id: number,
  name: string,
  organisation_id: number,
  organisation: ContactOrganisation,
  game_contact_roles: Array<ContactRole>,
  phone_number: string,
  email: string,
  dmn: boolean,
  dmr: boolean,
  status: ContactStatuses,
  status_description?: string,
  tv_channel_id: number | null,
  title: string | null,
};

export type CreateContactFormErrors = $Shape<{
  name: string,
  organisation: string,
  gameContactRoles: string,
  phone: string,
  email: string,
  mailingList: string,
}>;

export type TextEnum = {
  contactCreated: string,
  contactUpdated: string,
  error: {
    organisation: string,
    email: string,
    formSubmitted: string,
    mailingList: string,
    name: string,
    phone: string,
    gameContactRoles: string,
    status: ContactStatuses,
    statusDescription: string,
    emailAlreadyTaken: string,
  },
};

export type ReviewContactFormErrors = {
  status: ContactStatuses,
  statusDescription: string,
};

export type Review = {
  name: string,
  status: ContactStatuses,
  statusDescription: string,
};

export type TransformedContactRole = {
  id: number,
  role: string,
  required: boolean,
  kind: string,
  order: number,
  __reorder__: string,
  eventGameContactId?: number,
  name?: string,
  phone?: string,
  email?: string,
};
