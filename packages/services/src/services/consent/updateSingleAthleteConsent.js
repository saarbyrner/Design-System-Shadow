// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
  type Consent,
} from '@kitman/common/src/types/Consent';

export type RequestResponse = {
  data: Consent,
};

export type SingleUpdatePayload = {
  athlete_ids: number,
  consentable_type: $Keys<typeof CONSENTABLE_TYPE>,
  consenting_to: $Keys<typeof CONSENTING_TO>,
  updated_from: string,
};

export const endpoint = '/consent/update_consent';

const updateSingleAthleteConsent = async (
  singleCreate: SingleUpdatePayload
): Promise<RequestResponse> => {
  const { data } = await axios.patch(endpoint, singleCreate);

  return data;
};

export default updateSingleAthleteConsent;
