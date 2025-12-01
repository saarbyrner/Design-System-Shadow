// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  Meta,
  Organisation,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestResponse = {
  data: Array<Organisation>,
  meta: Meta,
};

export type Filters = {
  search_expression: string,
  per_page: number,
  page: number,
};

const searchOrganisationList = async (
  filters: Filters = {
    search_expression: '',
    per_page: 1,
    page: 1,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/organisations/search', {
    ...filters,
  });

  return data;
};

export default searchOrganisationList;
