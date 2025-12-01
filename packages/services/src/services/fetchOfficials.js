// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Official } from '@kitman/modules/src/Officials/shared/types';

export type Filters = {
  search_expression: string,
  include_inactive?: boolean,
};

const fetchOfficials = async (
  filters: Filters = {
    search_expression: '',
    include_inactive: false,
  }
): Promise<Array<Official>> => {
  const { data } = await axios.post('/settings/officials/search', filters);

  return data;
};

export default fetchOfficials;
