// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportMatchReport = async (
  filters: EventFilters
): Promise<ExportsItem> => {
  const {
    competitions,
    organisations,
    squad_names: squadNames,
    statuses,
    dateRange,
    search_expression: searchExpression,
  } = filters;

  const { data } = await axios.post('/export_jobs/match_report_export', {
    filter: {
      competitions,
      organisations,
      squad_names: squadNames,
      statuses,
      date_range: dateRange,
      search_expression: searchExpression,
    },
  });

  return data;
};

export default exportMatchReport;
