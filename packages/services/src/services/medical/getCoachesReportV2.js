// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Attachment } from '@kitman/common/src/types/Media';

export type GroupingTypeV2 =
  | 'availability_desc'
  | 'availability_asc'
  | 'position'
  | null;

export type AvailableColumnsV2 =
  | 'athlete_squad_names'
  | 'open_injuries_names'
  | 'availability_status'
  | 'unavailable_since'
  | 'position';

export type ReportConfigV2 = {
  reportDate: string,
  format: 'CSV' | 'PDF',
  grouping: GroupingTypeV2,
  columns: Array<AvailableColumnsV2>,
  squadIds: Array<number>,
  onlyIncludeMostRecentInjury: boolean,
  excludePlayersWithNoNotes: boolean,
};

export type CoachesReportV2Response = {
  id: number,
  name: 'Daily Status Report Export', // not dynamic atm
  export_type: 'coaches_report_export', // not dynamic atm
  created_at: string,
  attachments: Array<Attachment>,
  status: 'pending' | 'error', // async job will either be pending or fail
};

const getCoachesReportV2 = async ({
  format,
  reportDate,
  grouping,
  columns,
  squadIds,
  onlyIncludeMostRecentInjury,
  excludePlayersWithNoNotes,
}: ReportConfigV2): Promise<CoachesReportV2Response> => {
  const { data } = await axios.post('/export_jobs/daily_status_report_export', {
    name: 'Daily Status Report Export',
    report_date: reportDate,
    format,
    filters: {
      columns,
      grouping,
      squad_ids: squadIds,
      only_include_most_recent_injury: onlyIncludeMostRecentInjury,
      exclude_athletes_without_note: excludePlayersWithNoNotes,
    },
  });
  return data;
};

export default getCoachesReportV2;
