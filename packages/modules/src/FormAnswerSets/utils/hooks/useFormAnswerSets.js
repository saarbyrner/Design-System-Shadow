// @flow

import { type MetaCamelCase } from '@kitman/services/src/services/formTemplates/api/types';
import {
  type AnswersSet,
  type FormAnswersSetsFilters,
} from '@kitman/services/src/services/formAnswerSets/api/types';
import {
  useSearchFormAnswerSetsQuery,
  useSearchFreeAgentFormAnswerSetsQuery,
} from '@kitman/services/src/services/formAnswerSets';
import { useSelector } from 'react-redux';
import { getFilters } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import { type FormAnswerSetsState } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { type CustomHookReturnType } from '@kitman/common/src/hooks/useGlobalAppBasicLoader';

export const initialMeta: MetaCamelCase = {
  currentPage: 0,
  nextPage: 0,
  prevPage: 0,
  totalCount: 0,
  totalPages: 0,
};

const initialData = {
  data: [],
  meta: initialMeta,
};

export const useFormAnswerSets = (
  currentPage: number,
  rowsPerPage: number,
  filterOverrides?: FormAnswersSetsFilters
): ({
  rows: Array<AnswersSet>,
  meta: MetaCamelCase,
  refetch: () => void,
  ...$Exact<CustomHookReturnType>,
}) => {
  const filters: FormAnswerSetsState = useSelector(getFilters);

  // $FlowIgnore[cannot-spread-inexact]
  const commonParams: FormAnswersSetsFilters = {
    category: filters.category,
    athlete_id: Array.isArray(filters.athlete_id)
      ? filters.athlete_id[0]
      : filters.athlete_id,
    statuses: filters.statuses,
    date_range: filters.date_range,
    form_id: Array.isArray(filters.form_id)
      ? filters.form_id[0]
      : filters.form_id,
    form_category_id: filters.form_category_id,
    ...(filterOverrides ?? {}),
    pagination: {
      page: currentPage,
      per_page: rowsPerPage,
    },
  };

  const isFreeAgent =
    window.getFlag('pm-eforms-tryout') &&
    filters.athlete_status === 'free_agent';

  const activeQuery = useSearchFormAnswerSetsQuery(commonParams, {
    skip: isFreeAgent,
  });
  const freeAgentQuery = useSearchFreeAgentFormAnswerSetsQuery(commonParams, {
    skip: !isFreeAgent,
  });

  const query = isFreeAgent ? freeAgentQuery : activeQuery;

  const {
    refetch,
    data = initialData,
    isLoading,
    isSuccess,
    isError,
  }: {
    refetch: () => void,
    data: { data: Array<AnswersSet>, meta: MetaCamelCase },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = query;

  const { data: rows, meta } = data;

  return { isLoading, isSuccess, isError, rows, meta, refetch };
};

export default useFormAnswerSets;
