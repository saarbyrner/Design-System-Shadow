// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Squad } from '@kitman/common/src/types/Squad';
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type SquadSelection = Squad & {
  athletes: Array<Athlete>,
  default: boolean | null,
  positions: Array<string>,
};

export type RequestResponse = {
  data: Array<SquadSelection>,
};

export type PlayerSquadFilters = {
  search_term?: string,
  filters: {
    injured?: boolean,
    not_injured?: boolean,
  },
  grouping: {
    position?: boolean,
  },
};

const getSquadAthleteSearch = async (
  filters: PlayerSquadFilters = {
    search_terms: '',
    include_issue_occurrences: false,
    filters: {
      injured: false,
      not_injured: false,
    },
    grouping: {
      position: false,
    },
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/ui/squad_athletes/search', {
    ...filters,
  });

  return data;
};

export default getSquadAthleteSearch;
