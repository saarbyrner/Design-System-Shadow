// @flow
import { axios } from '@kitman/common/src/utils/services';

export type OshaFormDraftPayload = {
  // Allowing null values due to logic to ensure that we don't send empty string (null instead)
  issue_type: string | null,
  issue_id: number | null,
  athlete_id: number | null,
  reporter_full_name: string | null,
  reporter_phone_number: string | null,
  title: string | null,
  full_name: string | null,
  street: string | null,
  city: string | null,
  state: string | null,
  zip: string | null,
  date_hired: string | null,
  sex: string | null,
  physician_full_name: string | null,
  facility_name: string | null,
  facility_street: string | null,
  facility_city: string | null,
  facility_state: string | null,
  facility_zip: string | null,
  emergency_room: boolean | null,
  hospitalized: boolean | null,
  case_number: string | null,
  issue_date: string | null,
  time_began_work: string | null,
  time_event: string | null,
  athlete_activity: string | null,
  what_happened: string | null,
  issue_description: string | null,
  object_substance: string | null,
  date_of_death: string | null,
};

export const saveDraftOshaForm = async (
  formState: OshaFormDraftPayload
): Promise<any> => {
  const { data } = await axios.post(
    // $FlowFixMe athleteId cannot be null here as validation will have caught it
    `/athletes/${formState.athlete_id}/oshas/save_draft`,
    {
      ...formState,
    }
  );
  return data;
};
