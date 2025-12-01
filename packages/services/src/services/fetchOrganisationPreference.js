// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Preference = {
  value: boolean,
};

export type PreferenceKey =
  | 'coaching_principles'
  | 'enable_activity_type_category'
  | 'custom_privacy_policy'
  | 'hide_athlete_create_button'
  | 'optional_workers_comp_claim_policy_number';

const fetchOrganisationPreference = async (
  key: PreferenceKey
): Promise<Preference> => {
  try {
    const { data } = await axios.get(`/organisation_preferences/${key}`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default fetchOrganisationPreference;
