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

export type SingleCreatePayload = {
  athlete_ids: number,
  consentable_type: $Keys<typeof CONSENTABLE_TYPE>,
  consenting_to: $Keys<typeof CONSENTING_TO>,
  start_date: string,
  end_date: string,
};

export const endpoint = '/consent';

const saveSingleAthleteConsent = async (
  singleCreate: SingleCreatePayload
): Promise<RequestResponse> => {
  const { data } = await axios.post(endpoint, singleCreate);

  return data;
};

export default saveSingleAthleteConsent;
