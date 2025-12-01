// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { PhoneNumber } from '../getAthleteData';

export type DemographicReportType =
  | 'emergency_medical'
  | 'x_ray_game_day'
  | 'emergency_contacts';

export type SharedAllowedColumns =
  | 'id'
  | 'jersey_number'
  | 'fullname'
  | 'firstname'
  | 'lastname';

export type DemographicReportAllowedColumns =
  | SharedAllowedColumns
  | 'nfl_id'
  | 'position'
  | 'position_short'
  | 'dob_short'
  | 'date_of_birth'
  | 'height'
  | 'weight_pounds'
  | 'weight_kilograms'
  | 'allergies'
  | 'athlete_medical_alerts';

export type EmergencyContactsAllowedColumns =
  | SharedAllowedColumns
  | 'emergency_contacts';

export type EmergencyContactFieldNames =
  | 'id'
  | 'firstname'
  | 'lastname'
  | 'contact_relation'
  | 'email'
  | 'phone_numbers'
  | 'address_1'
  | 'address_2'
  | 'address_3'
  | 'city'
  | 'state_county'
  | 'zip_postal_code'
  | 'country';

export type EmergencyContact = {
  id: number,
  firstname: string,
  lastname: string,
  contact_relation: string,
  email: ?string,
  phone_numbers: Array<PhoneNumber>,
  address_1: ?string,
  address_2: ?string,
  address_3: ?string,
  city: ?string,
  zip_postal_code: ?string,
  state_county: ?string,
  country: ?string,
};

export type AthleteEmergencyContactData = {
  fullname: string,
  firstname: string,
  lastname: string,
  id: number,
  jersey_number?: ?string,
  emergency_contacts: Array<EmergencyContact>,
};

export type EmergencyContactsReport = {
  athletes: Array<AthleteEmergencyContactData>,
  unprocessable_columns: Array<EmergencyContactsAllowedColumns>,
  report_type: 'emergency_contacts',
};

export type AthleteDemographicData = {
  date_of_birth?: ?string,
  dob_short?: ?string,
  fullname: string,
  firstname: string,
  lastname: string,
  height?: ?string, // String will include unit
  weight_kilograms?: ?string, // String will include unit
  weight_pounds?: ?string, // String will include unit
  id: number,
  jersey_number?: ?string,
  position?: ?string,
  position_short?: ?string,
  nfl_id?: ?string,
  allergies?: Array<{
    id: number,
    display_name: string,
    severity: string,
  }>,
  athlete_medical_alerts?: Array<{
    id: number,
    display_name: string,
    severity: string,
  }>,
};

export type DemographicReport = {
  athletes: Array<AthleteDemographicData>,
  unprocessable_columns: Array<DemographicReportAllowedColumns>,
  report_type: 'emergency_medical' | 'x_ray_game_day',
};

const exportDemographicReport = async (
  reportType: DemographicReportType,
  population: SquadAthletesSelection,
  athleteColumns: Array<
    DemographicReportAllowedColumns | EmergencyContactsAllowedColumns
  >,
  emergencyContactsColumns?: Array<EmergencyContactFieldNames>
): Promise<DemographicReport | EmergencyContactsReport> => {
  const { data } = await axios.post(
    `/medical/rosters/demographic_report/${reportType}`,
    {
      population,
      columns: athleteColumns,
      emergency_contacts_columns: emergencyContactsColumns || undefined,
    }
  );

  return data;
};

export default exportDemographicReport;
