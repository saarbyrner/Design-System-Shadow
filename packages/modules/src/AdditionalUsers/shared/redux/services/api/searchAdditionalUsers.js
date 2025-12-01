// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  RequestResponse,
  Filters,
} from '@kitman/modules/src/AdditionalUsers/shared/types';

const searchAdditionalUsers = async (
  filters: Filters = {
    search_expression: '',
    is_active: true,
    include_inactive: false,
    types: [],
    per_page: 30,
    page: 0,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/settings/additional_users/search', {
    ...filters,
  });
  return data;
};

export default searchAdditionalUsers;
