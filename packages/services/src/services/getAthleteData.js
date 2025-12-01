// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Constraints } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';

type Country = {
  abbreviation: string,
  id: number,
  name: string,
};
type Address = {
  line1: ?string,
  line2: ?string,
  line3: ?string,
  city: ?string,
  zipcode: ?string,
  state: ?string,
  country: ?Country,
};
export type PhoneNumber = {
  country: string,
  number: string,
  number_international: string,
  number_international_e164: string,
  type: string,
};
type InsurancePolicy = {
  attachments: [],
  auth_phone_number: string,
  auth_req: string,
  contr_code: string,
  covers_dental: boolean,
  covers_medical: boolean,
  covers_rx: boolean,
  covers_vision: boolean,
  deductible: string,
  deductible_currency: string,
  effective_from: string,
  emp_notify: string,
  expires_on: string,
  group_number: string,
  id: number,
  is_primary: string,
  notes: string,
  policy_number: string,
  policy_owner_date_of_birth: string,
  policy_owner_firstname: string,
  policy_owner_id: string,
  policy_owner_lastname: string,
  policy_owner_relation: string,
  policy_type: string,
  provider: string,
  provider_address: string,
  provider_phone_number: string,
  rx_bin: string,
  rx_group: string,
  rx_pcn: string,
  serv_code: string,
};
export type EmergencyContact = {
  id: number,
  firstname: string,
  lastname: string,
  contact_relation: string,
  email: string,
  phone_numbers: Array<PhoneNumber>,
};

export type TransferType = 'Trade' | 'Trial';

export type TransferRecord = {
  data_sharing_consent: boolean,
  joined_at: ?string,
  left_at: ?string,
  transfer_type: TransferType,
};

export type TrialRecord = {
  data_sharing_consent: boolean,
  joined_at: string,
  left_at: ?string,
  transfer_type: TransferType,
};

export type Organisation = {
  id: number,
  name: string,
  logo_full_path: string,
};

export type AthleteData = {
  id: number,
  fullname: string,
  firstname: string,
  lastname: string,
  external_id: string,
  avatar_url: string,
  availability: AvailabilityStatus,
  date_of_birth: string,
  age: number,
  height: ?string,
  country: string,
  squad_names: Array<{ id: number, name: string }>,
  allergy_names: Array<string>,
  allergies?: Array<{
    id: number,
    display_name: string,
    severity: string,
  }>,
  athlete_medical_alerts: Array<{
    id: number,
    display_name: string,
    severity: string,
  }>,
  emergency_contacts: Array<EmergencyContact>,
  extended_attributes?: {
    nfl_player_id?: number,
  },
  insurance_policies: Array<InsurancePolicy>,
  unresolved_issues_count: number,
  position_id: number,
  position: string,
  position_group_id: number,
  position_group: string,
  weight: string,
  addresses: Array<Address>,
  email: string,
  mobile_number: string,
  squad: string,
  organisation_ids?: Array<number>,
  org_last_transfer_record?: ?TransferRecord,
  organisation_transfer_records?: Array<TransferRecord>,
  social_security_number: number,
  constraints?: ?Constraints,
  is_active: boolean,
  short_external_id: number,
};

const getAthleteData = async (athleteId: number): Promise<AthleteData> => {
  const { data } = await axios.get(`/medical/athletes/${athleteId}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  return data;
};

export default getAthleteData;
