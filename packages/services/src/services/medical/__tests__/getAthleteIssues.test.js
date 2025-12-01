import $ from 'jquery';

import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';

import getAthleteIssues from '../getAthleteIssues';

const { openIssues } = data;

describe('getAthleteIssues', () => {
  let getAthleteIssuesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getAthleteIssuesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(openIssues));
  });

  afterEach(() => {
    window.featureFlags = [];
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value when theres a valid athleteId', async () => {
    const returnedData = await getAthleteIssues({
      athleteId: 1,
      issueStatus: 'open',
    });

    expect(returnedData).toEqual(openIssues);

    expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/athletes/1/issue_occurrences',
      data: {
        issue_status: 'open',
        grouped: undefined,
        injury_status_ids: undefined,
        issue_type: undefined,
        occurrence_date_range: undefined,
        include_occurrence_type: true,
        page: undefined,
        per_page: undefined,
        search: undefined,
      },
    });
  });

  it('does not call the endpoint when there is not a valid athleteId', async () => {
    let returnedData;
    try {
      returnedData = await getAthleteIssues({
        athleteId: undefined,
        issueStatus: 'open',
      });
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toEqual(new Error('Not valid athleteId'));
    }

    expect(returnedData).toEqual(undefined);
    expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(0);
  });

  it('calls the correct endpoint for detailed issue response', async () => {
    await getAthleteIssues({
      athleteId: 1,
      issueStatus: 'open',
      includeDetailedIssue: true,
    });

    expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/athletes/1/issue_occurrences',
      data: {
        include_issue: true,
        detailed: true,
        issue_status: 'open',
        include_occurrence_type: true,
        injury_status_ids: undefined,
        issue_type: undefined,
        occurrence_date_range: undefined,
        page: undefined,
        per_page: undefined,
        search: undefined,
      },
    });
  });

  it('calls the correct endpoint with include_occurrence_type param', async () => {
    const returnedData = await getAthleteIssues({
      athleteId: 1,
      issueStatus: 'open',
      includeOccurrenceType: true,
    });

    expect(returnedData).toEqual(openIssues);

    expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/athletes/1/issue_occurrences',
      data: {
        issue_status: 'open',
        grouped: undefined,
        injury_status_ids: undefined,
        include_occurrence_type: true,
        issue_type: undefined,
        occurrence_date_range: undefined,
        page: undefined,
        per_page: undefined,
        search: undefined,
      },
    });
  });

  it('calls the correct endpoint with include_occurrence_type param set to false', async () => {
    const returnedData = await getAthleteIssues({
      athleteId: 1,
      issueStatus: 'open',
      includeOccurrenceType: false,
    });

    expect(returnedData).toEqual(openIssues);

    expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/athletes/1/issue_occurrences',
      data: {
        issue_status: 'open',
        grouped: undefined,
        injury_status_ids: undefined,
        include_occurrence_type: false,
        issue_type: undefined,
        occurrence_date_range: undefined,
        page: undefined,
        per_page: undefined,
        search: undefined,
      },
    });
  });

  describe('[FEATURE FLAG] - hide-player-left-club TRUE', () => {
    beforeEach(() => {
      window.featureFlags['hide-player-left-club'] = true;
      window.featureFlags['nfl-player-movement-trade'] = true;
    });

    afterEach(() => {
      window.featureFlags['hide-player-left-club'] = false;
      window.featureFlags['nfl-player-movement-trade'] = false;
    });

    it('adds hide_player_left_club param when issueStatus open', async () => {
      const returnedData = await getAthleteIssues({
        athleteId: 1,
        issueStatus: 'open',
        grouped: false,
        includePreviousOrganisation: false,
        limitToCurrOrg: false,
      });

      expect(returnedData).toEqual(openIssues);

      expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
      expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/athletes/1/issue_occurrences',
        data: {
          issue_status: 'open',
          grouped: false,
          hide_player_left_club: true,
          include_previous_organisation: false,
          limit_to_current_organisation: false,
          include_occurrence_type: true,
          detailed: undefined,
          include_issue: undefined,
          injury_status_ids: undefined,
          issue_type: undefined,
          occurrence_date_range: undefined,
          page: undefined,
          per_page: undefined,
          search: undefined,
        },
      });
    });

    it('adds hide_player_left_club param when issueStatus closed', async () => {
      await getAthleteIssues({
        athleteId: 1,
        issueStatus: 'closed',
        grouped: false,
        includePreviousOrganisation: false,
        limitToCurrOrg: false,
      });

      expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
      expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/athletes/1/issue_occurrences/prior',
        data: {
          issue_status: 'closed',
          hide_player_left_club: true,
          include_previous_organisation: false,
          include_occurrence_type: true,
          limit_to_current_organisation: false,
          grouped: false,
          include_issue: undefined,
          detailed: undefined,
          injury_status_ids: undefined,
          issue_type: undefined,
          occurrence_date_range: undefined,
          page: undefined,
          per_page: undefined,
          search: undefined,
        },
      });
    });

    it('does not add hide_player_left_club param when issueStatus archived', async () => {
      const returnedData = await getAthleteIssues({
        athleteId: 1,
        issueStatus: 'archived',
        grouped: false,
        includePreviousOrganisation: false,
        limitToCurrOrg: false,
      });

      expect(returnedData).toEqual(openIssues);

      expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
      expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/athletes/1/issue_occurrences',
        // see payload does not include hide_player_left_club
        data: {
          issue_status: 'archived',
          grouped: false,
          hide_player_left_club: false,
          include_previous_organisation: false,
          limit_to_current_organisation: false,
          include_occurrence_type: true,
          detailed: undefined,
          include_issue: undefined,
          injury_status_ids: undefined,
          issue_type: undefined,
          occurrence_date_range: undefined,
          page: undefined,
          per_page: undefined,
          search: undefined,
        },
      });
    });

    it('does not add hide_player_left_club param when issueStatus chronic', async () => {
      const returnedData = await getAthleteIssues({
        athleteId: 1,
        issueStatus: 'chronic',
        grouped: false,
        includePreviousOrganisation: false,
        limitToCurrOrg: false,
      });

      expect(returnedData).toEqual(openIssues);

      expect(getAthleteIssuesRequest).toHaveBeenCalledTimes(1);
      expect(getAthleteIssuesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/athletes/1/issue_occurrences',
        // see payload does not include hide_player_left_club
        data: {
          issue_status: 'chronic',
          grouped: false,
          hide_player_left_club: false,
          include_previous_organisation: false,
          include_occurrence_type: true,
          limit_to_current_organisation: false,
          detailed: undefined,
          include_issue: undefined,
          injury_status_ids: undefined,
          issue_type: undefined,
          occurrence_date_range: undefined,
          page: undefined,
          per_page: undefined,
          search: undefined,
        },
      });
    });
  });
});
