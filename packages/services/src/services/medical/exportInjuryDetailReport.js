// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import type { ExportsItem } from '@kitman/common/src/types/Exports';
import { type ReportColumn } from '@kitman/services/src/services/medical/getReportColumns';

export type CodingData = {
  codes?: Array<number | string>,
  body_area_ids?: Array<number>,
};

type DateRange = {
  start_time: string,
  end_time: string,
};

export type InjuryDetailReportFilters = {
  resolved?: boolean,
  include_created_by_prior_club?: boolean,
  date_ranges: Array<DateRange>,
  coding?: {
    [CodingSystemKey]: CodingData,
  },
  coding_system_pathologies?: {
    ids?: Array<number>,
    codes?: Array<string>,
    body_regions_ids?: Array<number>,
    body_area_ids?: Array<number>,
    tissue_ids?: Array<number>,
    classification_ids?: Array<number>,
    side_ids?: Array<number>,
  },
};

const exportInjuryDetailReport = async (
  issueTypes: Array<'Injury' | 'Illness'>,
  population: SquadAthletesSelection,
  columns: Array<ReportColumn>,
  filters: ?InjuryDetailReportFilters,
  includePastPlayers: boolean = false,
  format: 'csv' | 'xlsx' | 'json'
): Promise<ExportsItem> => {
  const response = await axios.post(
    '/export_jobs/injury_detail_export',
    {
      issue_types: issueTypes,
      population,
      columns,
      filters,
      include_past_players: includePastPlayers,
      format,
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportInjuryDetailReport;
