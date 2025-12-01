// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

export type TimeLossAllActivitiesReportAllowedColumns =
  | 'issue_date'
  | 'athlete_id'
  | 'player_id'
  | 'player_name'
  | 'issue_name'
  | 'return_to_full'
  | 'games_missed'
  | 'practices_missed'
  | 'otas_missed'
  | 'walkthroughs_missed'
  | 'mini_camps_missed'
  | 'player_activity';

type DateRange = {
  start_time: string,
  end_time: string,
};

export type ExportTimeLossAllActivitiesFilters = {
  include_created_by_prior_club?: boolean,
  date_ranges: Array<DateRange>,
};

const exportTimeLossAllActivitiesReport = async (
  issueTypes: Array<'Injury' | 'Illness'>,
  population: SquadAthletesSelection,
  columns: Array<TimeLossAllActivitiesReportAllowedColumns>,
  filters: ?ExportTimeLossAllActivitiesFilters,
  format: 'csv' | 'xlsx' | 'json',
  includePastPlayers: boolean,
  includeDemographics?: boolean
): Promise<ExportsItem> => {
  const response = await axios.post(
    `/export_jobs/time_loss_all_activity_export`,
    {
      format,
      include_demographics: includeDemographics,
      issue_types: issueTypes,
      population,
      columns,
      filters,
      include_past_players: includePastPlayers,
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportTimeLossAllActivitiesReport;
