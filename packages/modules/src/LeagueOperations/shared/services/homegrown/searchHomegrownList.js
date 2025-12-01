// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  Meta,
  Homegrown,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestResponse = {
  data: Array<Homegrown>,
  meta: Meta,
};

export type Filters = {
  search_expression: string,
  per_page: number,
  page: number,
};

const searchHomegrownList = async (
  filters: Filters = {
    search_expression: '',
    per_page: 30,
    page: 0,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/homegrown/search', {
    ...filters,
  });
  return data;
};

export default searchHomegrownList;
