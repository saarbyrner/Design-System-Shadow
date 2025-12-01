import {
  csvData,
  ungroupedData,
  groupedData,
  doubleGroupedData,
} from '@kitman/services/src/mocks/handlers/medical/getCoachesReport';
import { axios } from '@kitman/common/src/utils/services';
import getCoachesReport from '../getCoachesReport';

describe('getCoachesReport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const columns = [
    'athlete',
    'issue_name',
    'onset_date',
    'player_id',
    'jersey_number',
    'body_part',
    'position',
    'pathology',
    'side',
    'comment',
    'injury_status',
    'latest_note',
  ];

  const population = [
    {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [2942, 40211, 1644],
      squads: [],
      context_squads: [8],
    },
  ];

  it('labels ungrouped data', async () => {
    const returnedData = await getCoachesReport({
      format: 'JSON',
      issueTypes: [],
      population,
      grouping: { type: 'no_grouping', reverse: false },
      columns,
      sortKey: 'name',
      hidePlayersThatLeftClub: true,
      excludeUninjuredPlayers: true,
    });

    expect(returnedData).toEqual({
      groupingType: 'single',
      athlete: ungroupedData,
    });
  });

  it('labels grouped data', async () => {
    const returnedData = await getCoachesReport({
      format: 'JSON',
      issueTypes: [],
      population,
      grouping: { type: 'position_group', reverse: false },
      columns,
      sortKey: 'name',
      hidePlayersThatLeftClub: true,
      excludeUninjuredPlayers: true,
    });

    expect(returnedData).toEqual({ ...groupedData, groupingType: 'single' });
  });

  it('labels double grouped data', async () => {
    const returnedData = await getCoachesReport({
      format: 'JSON',
      issueTypes: [],
      population,
      grouping: { reverse: false, type: 'position_group_position' },
      columns,
      sortKey: 'name',
      hidePlayersThatLeftClub: true,
      excludeUninjuredPlayers: true,
    });

    expect(returnedData).toEqual({
      ...doubleGroupedData,
      groupingType: 'double',
    });
  });

  it('returns CSV data', async () => {
    const returnedData = await getCoachesReport({
      format: 'CSV',
      issueTypes: [],
      population,
      grouping: { type: 'no_grouping', reverse: false },
      columns,
      sortKey: 'name',
      hidePlayersThatLeftClub: true,
      excludeUninjuredPlayers: true,
    });

    expect(returnedData).toEqual(csvData);
  });

  describe('Mock axios', () => {
    let request;
    const reportConfig = {
      format: 'JSON',
      issueTypes: [],
      population,
      grouping: { reverse: false, type: 'position_group_position' },
      columns,
      sortKey: 'name',
      hidePlayersThatLeftClub: true,
      excludeUninjuredPlayers: true,
    };

    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      await getCoachesReport({
        format: 'JSON',
        issueTypes: [],
        population,
        grouping: { type: 'position_group_position', reverse: false },
        columns,
        sortKey: 'name',
        hidePlayersThatLeftClub: true,
        excludeUninjuredPlayers: true,
      });

      const bodyData = {
        columns: reportConfig.columns,
        exclude_uninjured_players: true,
        format: reportConfig.format,
        grouping: reportConfig.grouping,
        hide_player_left_club: reportConfig.hidePlayersThatLeftClub,
        issue_types: reportConfig.issueTypes,
        population: reportConfig.population,
        sort_key: reportConfig.sortKey,
      };
      expect(request).toHaveBeenCalledWith(
        '/medical/coaches/report',
        bodyData,
        { timeout: 60000 }
      );
    });
  });
});
