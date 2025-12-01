// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

export type MedicationExportAllowedColumns =
  | 'player_name'
  | 'reason'
  | 'medication'
  | 'start_date'
  | 'end_date'
  | 'nfl_id'
  | 'injury_date'
  | 'dosage'
  | 'quantity'
  | 'type'
  | 'external_prescriber_name';

type DateRange = {
  start_date: string,
  end_date: string,
};

export type MedicationExportFilters = {
  report_range: DateRange,
  include_all_active: boolean,
  archived: false,
};

const exportMedicationsReport = async ({
  population,
  columns,
  filters,
  format,
}: {
  population: SquadAthletesSelection,
  columns: Array<MedicationExportAllowedColumns>,
  filters: ?MedicationExportFilters,
  format: 'pdf' | 'csv',
}): Promise<ExportsItem> => {
  const response = await axios.post(
    '/export_jobs/medications_report_export',
    {
      population,
      columns,
      filters,
      format,
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportMedicationsReport;
