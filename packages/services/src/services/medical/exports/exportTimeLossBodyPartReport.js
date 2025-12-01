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

export type ExportTimeLossBodyPartFilters = {
  include_created_by_prior_club?: boolean,
  date_ranges: Array<DateRange>,
  coding?: {
    [CodingSystemKey]: CodingData,
  },
};

const exportTimeLossBodyPartReport = async ({
  issueTypes,
  population,
  columns,
  filters,
  format,
  includePastPlayers,
}: {
  issueTypes: Array<'Injury' | 'Illness'>,
  population: SquadAthletesSelection,
  columns: Array<ReportColumn>,
  filters: ?ExportTimeLossBodyPartFilters,
  format: 'csv' | 'xlsx' | 'json',
  includePastPlayers: boolean,
}): Promise<ExportsItem> => {
  const response = await axios.post(
    `/export_jobs/time_loss_body_part_export`,
    {
      issue_types: issueTypes,
      population,
      columns,
      filters,
      format,
      include_past_players: includePastPlayers,
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportTimeLossBodyPartReport;
