// @flow
import { axios } from '@kitman/common/src/utils/services';

import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
  CONSENT_STATUS_KEY,
  type Athlete,
  type Meta,
} from '@kitman/common/src/types/Consent';

export type RequestResponse = {
  data: Array<Athlete>,
  meta: Meta,
};

export type Filters = {
  consentable_type: $Keys<typeof CONSENTABLE_TYPE>,
  consenting_to: $Keys<typeof CONSENTING_TO>,
  search_expression?: string,
  include_inactive?: boolean,
  is_active?: boolean,
  consent_status?: ?Array<$Values<typeof CONSENT_STATUS_KEY>>,
  squad_ids?: ?Array<number>,
  per_page?: number,
  page?: number,
};

export const endpoint = '/consent/search_athletes';

const searchAthletes = async (filters: Filters): Promise<RequestResponse> => {
  const { data } = await axios.post(endpoint, filters);

  return data;
};

export default searchAthletes;
