// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ImportsResponse,
  ImportType,
  CamelCasedImportsResponse,
} from '@kitman/common/src/types/Imports';

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type ImportStatus = 'pending' | 'running' | 'completed' | 'errored';

export type Filters = {
  per_page?: number,
  page?: number,
  creator_ids: Array<number>,
  import_types: Array<ImportType>,
  statuses: Array<ImportStatus>,
};

const searchImportsList = async (
  filters: Filters = {
    per_page: 25,
    page: 0,
    creator_ids: [],
    import_types: [],
    statuses: [],
  }
): Promise<ImportsResponse> => {
  const { data } = await axios.post('/import_jobs/search', {
    ...filters,
  });

  return data;
};

export type CamelCasedFilters = {
  perPage?: number,
  page?: number,
  creatorIds: Array<number>,
  importTypes: Array<ImportType>,
  statuses: Array<ImportStatus>,
  isInCamelCase?: boolean,
};

export const camelCasedSearchImportsList = async (
  filters: CamelCasedFilters
): Promise<CamelCasedImportsResponse> => {
  // CamelCasedFilters['isInCamelCase'] allows to use camel case
  // when a function expects snake case.
  // $FlowIgnore
  return searchImportsList(filters);
};

export default searchImportsList;
