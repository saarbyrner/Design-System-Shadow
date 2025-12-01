// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

export type CoachesReportRow = {
  athlete: {
    name: string,
    id: number,
    extended_attributes?: {
      nfl_player_id?: string,
    },
  },
  body_area: string,
  injury: string,
  occurrence_date: string,
  position: {
    name: string,
    abbreviation: ?string,
    group: string,
    order: number,
  },
  position_group: {
    name: string,
    order: number,
  },
  side: ?string,
  squad_number: ?number,
  latest_note: ?string,
  status: {
    description: string,
    order: number,
  },
  pathology: ?string,
  comment: ?string,
};

export type groupingType =
  | 'no_grouping'
  | 'injury_status'
  | 'position_group'
  | 'position_group_position';

export type GroupConfig = {
  reverse: boolean,
  type: groupingType,
};

export type CoachesReportGrouped = {
  [string]: Array<CoachesReportRow>,
  groupingType: 'single',
};

export type CoachesReportDoubleGrouped = {
  [string]: CoachesReportGrouped,
  groupingType: 'double',
};

export type AvailableColumns =
  | 'athlete'
  | 'athlete_id'
  | 'issue_name'
  | 'onset_date'
  | 'player_id'
  | 'jersey_number'
  | 'body_part'
  | 'position'
  | 'pathology'
  | 'side'
  | 'comment'
  | 'modification'
  | 'injury_status'
  | 'latest_note';

export type ReportConfig = {
  format: 'CSV' | 'JSON',
  issueTypes: Array<'Injury' | 'Illness'>,
  population?: SquadAthletesSelection[],
  grouping: GroupConfig,
  sortKey: 'name' | 'date' | 'name_date',
  columns: Array<AvailableColumns>,
  hidePlayersThatLeftClub: boolean,
  excludeUninjuredPlayers: boolean,
  worstInjuryOnly: boolean,
};

const getCoachesReport = async ({
  format,
  issueTypes,
  population,
  grouping,
  sortKey,
  columns,
  hidePlayersThatLeftClub,
  excludeUninjuredPlayers,
  worstInjuryOnly,
}: ReportConfig): Promise<
  CoachesReportGrouped | CoachesReportDoubleGrouped | string
> => {
  const { data } = await axios.post(
    '/medical/coaches/report',
    {
      columns,
      format,
      grouping,
      hide_player_left_club: hidePlayersThatLeftClub,
      issue_types: issueTypes,
      population: population || [],
      sort_key: sortKey,
      exclude_uninjured_players: excludeUninjuredPlayers,
      worst_injury_status: worstInjuryOnly,
    },
    { timeout: 60000 } // Set a timeout of 1 min
  );

  if (format === 'CSV' && typeof data === 'string') {
    return data;
  }

  if (grouping.type === 'position_group_position') {
    const doubleGroupedData: CoachesReportDoubleGrouped = {
      ...data,
      groupingType: 'double',
    };

    return doubleGroupedData;
  }

  if (grouping.type === 'no_grouping') {
    const singleGroupedData: CoachesReportGrouped = {
      athlete: data,
      groupingType: 'single',
    };

    return singleGroupedData;
  }

  return {
    ...data,
    groupingType: 'single',
  };
};

export default getCoachesReport;
