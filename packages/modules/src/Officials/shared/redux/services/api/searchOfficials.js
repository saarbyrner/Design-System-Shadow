// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  Meta,
  Official,
  Filters,
} from '@kitman/modules/src/Officials/shared/types';

export type RequestResponse = {
  data: Array<Official>,
  meta: Meta,
};

const searchOfficials = async (
  filters: Filters = {
    search_expression: '',
    is_active: true,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/officials/search', {
    ...filters,
  });

  return data;
};

export default searchOfficials;
