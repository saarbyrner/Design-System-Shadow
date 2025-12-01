// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  DisciplineSearchParams,
  DisciplineSearchResponse,
} from '../types/discipline';
import { mapDateToServerFormant } from '../utils';

const searchDisciplineAthleteList = async (
  filters: DisciplineSearchParams = {
    search_expression: '',
    per_page: 30,
    page: 0,
    competition_ids: [],
    yellow_cards: { min: null, max: null },
    red_cards: { min: null, max: null },
    date_range: { start_date: null, end_date: null },
  }
): Promise<DisciplineSearchResponse> => {
  const { data } = await axios.post('/discipline/athletes/search', {
    ...filters,
    date_range: {
      start_date: mapDateToServerFormant(filters.date_range?.start_date),
      end_date: mapDateToServerFormant(filters.date_range?.end_date),
    },
  });
  return data;
};

export default searchDisciplineAthleteList;
