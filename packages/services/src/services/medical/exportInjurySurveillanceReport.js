// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

type DateRange = Array<{
  start_time: string | null,
  end_time: string | null,
}>;

type ExportParams = {
  name: string,
  squads: Array<number>,
  dateRange: DateRange,
  anonymiseReport: boolean,
  screeningRulesetIds: Array<number>,
  format: 'csv' | 'xlsx' | 'json',
  includePastPlayers: boolean,
};

const exportInjurySurveillanceReport = async ({
  name,
  squads,
  dateRange,
  anonymiseReport,
  screeningRulesetIds,
  format,
  includePastPlayers = false,
}: ExportParams): Promise<ExportsItem> => {
  const response = await axios.post(
    `/export_jobs/injury_surveillance_export`,
    {
      name,
      format,
      anonymise_report: anonymiseReport,
      screening_ruleset_ids: screeningRulesetIds,
      include_past_players: includePastPlayers,
      population: [
        {
          squads,
        },
      ],
      filters: {
        date_ranges: dateRange,
      },
    },
    { timeout: 0 }
  );

  return response.data;
};

export default exportInjurySurveillanceReport;
