// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
  type Consent,
} from '@kitman/common/src/types/Consent';

export type RequestResponse = {
  data: Array<Consent>,
};

export type BulkCreatePayload = {
  athlete_ids: Array<number>,
  consentable_type: $Keys<typeof CONSENTABLE_TYPE>,
  consenting_to: $Keys<typeof CONSENTING_TO>,
  start_date: string,
  end_date: string,
};

export const endpoint = '/consent/bulk_create';

const saveAthletesConsent = async (
  bulkCreate: BulkCreatePayload
): Promise<RequestResponse> => {
  const { data } = await axios.post(endpoint, bulkCreate);

  return data;
};

export default saveAthletesConsent;
