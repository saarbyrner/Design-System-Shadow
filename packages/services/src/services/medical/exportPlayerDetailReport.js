// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

export const EXPORT_PLAYER_DETAIL_REPORT_URL =
  '/export_jobs/nfl_player_detail_report';

const exportPlayerDetailReport = async (
  populations: Object,
  columns: string[],
  filters: Object,
  includePastPlayers: boolean,
  format: 'csv' | 'xlsx' | 'pdf'
): Promise<ExportsItem> => {
  const { data } = await axios.post(EXPORT_PLAYER_DETAIL_REPORT_URL, {
    populations,
    columns,
    filters,
    include_past_players: includePastPlayers,
    format,
  });
  return data;
};

export default exportPlayerDetailReport;
