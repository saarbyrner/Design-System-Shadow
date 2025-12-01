// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

type DateRange = {
  start_time: string,
  end_time: string,
};

export type Osha300ReportFilters = {
  date_range: DateRange,
  include_created_by_prior_club?: boolean,
};

const exportOsha300Report = async ({
  filters,
  format,
}: {
  filters: ?Osha300ReportFilters,
  format: 'csv' | 'xlsx' | 'pdf',
}): Promise<ExportsItem> => {
  const response = await axios.post(
    '/export_jobs/osha_report_export',
    {
      filters,
      format,
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportOsha300Report;
