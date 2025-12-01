// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { MovementOrganisation } from '../../../types';

export type RequestResponse = Array<MovementOrganisation>;

export type Filters = {
  exclude_memberships?: boolean,
  exclude_trials?: boolean,
  exclude_trials_v2?: boolean,
  exclude_trades?: boolean,
  user_id: number,
};

const defaultFilters: Filters = {
  user_id: 0,
};

const searchMovementOrganisationsList = async (
  filters: Filters = defaultFilters
): Promise<RequestResponse> => {
  const { data } = await axios.post('/ui/associations/organisations', {
    ...defaultFilters,
    ...filters,
  });
  return data;
};

export default searchMovementOrganisationsList;
