// @flow
import { axios } from '@kitman/common/src/utils/services';

export type WorkersCompSubmitPayload = {
  // Allowing null values due to logic to ensure that we don't send empty string (null instead)
  issue_type: string | null,
  issue_id: number | null,
  athlete_id: number | null,
  reporter_first_name: string | null,
  reporter_last_name: string | null,
  reporter_phone_number: string | null,
  loss_date: string | null,
  loss_description: string | null,
  loss_city: string | null,
  loss_state: string | null,
  loss_jurisdiction: string | null,
  policy_number: string | null,
  athlete_first_name: string | null,
  athlete_last_name: string | null,
  athlete_address_line_1: string | null,
  athlete_address_line_2: string | null,
  athlete_city: string | null,
  athlete_state: string | null,
  athlete_zip: string | null,
  athlete_phone_number: string | null,
  side: number | null,
  body_area: number | null,
};

const submitWorkersComp = async (
  formState: WorkersCompSubmitPayload
): Promise<any> => {
  const { data } = await axios.post(
    // $FlowFixMe athleteId cannot be null here as validation will have caught it
    `/athletes/${formState.athlete_id}/workers_comps`,
    {
      ...formState,
    }
  );
  return data;
};

export default submitWorkersComp;
