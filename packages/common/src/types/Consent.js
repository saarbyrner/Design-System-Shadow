// @flow
import type { Squad } from '@kitman/components/src/Athletes/types';

export const CONSENT_STATUS = {
  NoConsent: 'No consent',
  Expired: 'Expired',
  Consented: 'Consented',
};

export const CONSENT_STATUS_KEY = {
  NoConsent: 'no_consent',
  Expired: 'expired',
  Consented: 'consented',
};

export const CONSENTABLE_TYPE = {
  Organisation: 'Organisation',
  Association: 'Association',
  Squad: 'Squad',
};

export const CONSENTING_TO = {
  injury_surveillance_export: 'injury_surveillance_export',
};

export type User = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type Consent = {
  id: number,
  athlete_id: number,
  consentable_type: $Keys<typeof CONSENTABLE_TYPE>,
  consentable_id: number,
  consenting_to: $Keys<typeof CONSENTING_TO>,
  start_date: string,
  end_date: string,
  archive_reason: ?string,
  archived_on: ?string,
  archived_by: ?User,
  created_by: User,
  created_at: string,
  updated_at: string,
};

export type Athlete = {
  id: number,
  avatar_url: string,
  date_of_birth: ?string,
  firstname: string,
  fullname: string,
  lastname: string,
  email: string,
  shortname: string,
  user_id: number,
  athlete_squads: Array<Squad>,
  position: string,
  consented: boolean,
  consent_status: string,
  most_recent_consent: ?Consent,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};
