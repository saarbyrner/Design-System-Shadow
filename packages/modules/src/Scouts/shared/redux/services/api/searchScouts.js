// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  Meta,
  Scout,
  Filters,
} from '@kitman/modules/src/Scouts/shared/types';

export type RequestResponse = {
  data: Array<Scout>,
  meta: Meta,
};

const searchScouts = async (
  user: Filters = {
    search_expression: '',
    is_active: true,
    types: ['scout'],
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/scouts/search', {
    ...user,
  });

  return data;
};

export default searchScouts;
