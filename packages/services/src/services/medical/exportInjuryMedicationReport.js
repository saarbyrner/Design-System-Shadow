// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

export type InjuryMedicationReportAllowedColumns =
  | 'player_name'
  | 'issue_name'
  | 'issue_date'
  | 'medications';

export type InjuryMedicationEntry = {
  issue_date: string, // preformatted by backend
  issue_name: ?string,
  player_name: string,
  athlete_id: number,
  medications: Array<{
    medication: string,
    prescription_date: string, // preformatted by backend
  }>,
};

type DateRange = {
  start_time: string,
  end_time: string,
};

export type InjuryMedicationReportFilters = {
  include_created_by_prior_club?: boolean,
  date_ranges: Array<DateRange>,
};

const exportInjuryMedicationReport = async (
  issueTypes: Array<'Injury' | 'Illness'>,
  population: SquadAthletesSelection,
  columns: Array<InjuryMedicationReportAllowedColumns>,
  filters: ?InjuryMedicationReportFilters,
  includePastPlayers: boolean = false,
  format: 'csv' | 'xlsx' | 'json'
): Promise<ExportsItem> => {
  const response = await axios.post(
    `/export_jobs/injury_medication_export`,
    {
      issue_types: issueTypes,
      population,
      columns,
      filters,
      include_past_players: includePastPlayers,
      format,
      name: 'Appendix BB Report',
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportInjuryMedicationReport;
