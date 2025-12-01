import moment from 'moment-timezone';
import { getDefaultEventFilters } from '../utils';

describe('getDefaultEventFilters', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    const twentyHeightOfFebruary = new Date(Date.UTC(2020, 1, 28, 0, 0, 0));
    Date.now = jest.fn(() => twentyHeightOfFebruary);
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the correct default event filters 4 weeks in the past to 4 weeks in the future', () => {
    expect(getDefaultEventFilters({})).toEqual({
      dateRange: {
        start_date: '2020-01-31T00:00:00+00:00',
        end_date: '2020-03-27T23:59:59+00:00',
      },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
      search_expression: '',
      round_number: '',
    });
  });

  describe('when the report filters param is passed in', () => {
    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ isReportFilters: true })).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-09T23:59:59+00:00',
          start_date: '2020-02-18T00:00:00+00:00',
        },
        eventTypes: [],
        gameDays: [],
        include_game_status: true,
        oppositions: [],
        organisations: [],
        round_number: '',
        search_expression: '',
        squad_names: [],
        start_time_asc: true,
        statuses: [],
      });
    });
  });

  describe('when the isGameEvents param is passed in', () => {
    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ isGameEvents: true })).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        eventTypes: ['game_event'],
        gameDays: [],

        oppositions: [],
        round_number: '',
        search_expression: '',
      });
    });
  });

  describe('when the is supervisor view param is passed in', () => {
    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ isSupervisorView: true })).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        eventTypes: [],
        gameDays: [],
        oppositions: [],
        round_number: '',
        search_expression: '',
        supervisor_view: true,
      });
    });
  });

  describe('when the isLeague param is passed in', () => {
    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ isLeague: true })).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        eventTypes: [],
        gameDays: [],
        oppositions: [],
        round_number: '',
        search_expression: '',
        include_division: true,
      });
    });
  });

  describe('when the isScoutAccess param is passed in', () => {
    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ isScoutAccess: true })).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        eventTypes: [],
        gameDays: [],
        oppositions: [],
        round_number: '',
        search_expression: '',
        user_event_requests_statuses: [],
        include_access_request_accessible: true,
        include_access_request_time_valid: true,
      });
    });

    it('returns correct filters when the league user has the manageScoutAccess perm', () => {
      expect(
        getDefaultEventFilters({
          isScoutAccess: true,
          canManageScoutAccess: true,
          isLeague: true,
          organisationId: 5,
        })
      ).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        include_division: true,
        eventTypes: [],
        gameDays: [],
        oppositions: [],
        round_number: '',
        search_expression: '',
        user_event_requests_statuses: [],
        include_access_request_accessible: true,
        include_access_request_time_valid: true,
        include_scout_attendees: false,
        includeUserEventRequestsCounts: true,
      });
    });

    it('returns correct filters when the club user has the manageScoutAccess perm and [feature flag: league-ops-sam-enable-scout-atendees] is on', () => {
      expect(
        getDefaultEventFilters({
          isScoutAccess: true,
          canManageScoutAccess: true,
          isLeague: false,
          organisationId: 5,
          isScoutAttendeesEnabled: true,
        })
      ).toEqual({
        competitions: [],
        dateRange: {
          end_date: '2020-03-27T23:59:59+00:00',
          start_date: '2020-01-31T00:00:00+00:00',
        },
        eventTypes: [],
        gameDays: [],
        oppositions: [],
        round_number: '',
        search_expression: '',
        user_event_requests_statuses: [],
        include_access_request_accessible: true,
        include_access_request_time_valid: true,
        include_scout_attendees: true,
        includeUserEventRequestsCounts: true,
        organisations: [5],
      });
    });
  });

  it('returns correct filters when the club user has the manageScoutAccess perm and [feature flag: league-ops-sam-enable-scout-atendees] is off', () => {
    expect(
      getDefaultEventFilters({
        isScoutAccess: true,
        canManageScoutAccess: true,
        isLeague: false,
        organisationId: 5,
        isScoutAttendeesEnabled: false,
      })
    ).toEqual({
      competitions: [],
      dateRange: {
        end_date: '2020-03-27T23:59:59+00:00',
        start_date: '2020-01-31T00:00:00+00:00',
      },
      eventTypes: [],
      gameDays: [],
      oppositions: [],
      round_number: '',
      search_expression: '',
      user_event_requests_statuses: [],
      include_access_request_accessible: true,
      include_access_request_time_valid: true,
      include_scout_attendees: false,
      includeUserEventRequestsCounts: true,
      organisations: [5],
    });
  });

  describe('when ‘repeat-events’ feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags['repeat-events'] = true;
    });

    afterEach(() => {
      window.featureFlags['repeat-events'] = false;
    });

    it('returns correct filters', () => {
      expect(getDefaultEventFilters({})).toEqual({
        dateRange: {
          start_date: '2020-01-31T00:00:00+00:00',
          end_date: '2020-03-27T23:59:59+00:00',
        },
        eventTypes: [],
        competitions: [],
        gameDays: [],
        oppositions: [],
        areRecurringEventsIncluded: true,
        search_expression: '',
        round_number: '',
      });
    });
  });

  describe('when ‘repeat-sessions’ feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags['repeat-sessions'] = true;
    });

    afterEach(() => {
      window.featureFlags['repeat-sessions'] = false;
    });

    it('returns correct filters', () => {
      expect(getDefaultEventFilters({})).toEqual({
        dateRange: {
          start_date: '2020-01-31T00:00:00+00:00',
          end_date: '2020-03-27T23:59:59+00:00',
        },
        eventTypes: [],
        competitions: [],
        gameDays: [],
        oppositions: [],
        areRecurringEventsIncluded: true,
        search_expression: '',
        round_number: '',
      });
    });
  });

  describe('when league_game_schedule preference is on', () => {
    const preferences = {
      league_game_schedule: true,
    };

    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ preferences })).toEqual({
        competitions: [],
        dateRange: {
          start_date: '2020-02-28T00:00:00+00:00',
          end_date: '2020-03-13T23:59:59+00:00',
        },
        eventTypes: [],
        gameDays: [],
        include_away_dmr: true,
        include_game_kit_matrix: true,
        include_home_dmr: true,
        include_kit_matrix: true,
        include_time: true,
        include_game_participants_lock_time: true,
        include_match_director: true,
        include_tv_channels: true,
        include_tv_game_contacts: true,
        oppositions: [],
        search_expression: '',
        round_number: '',
      });
    });
  });

  describe('when the match monitors preference is on', () => {
    const preferences = {
      match_monitor: true,
    };

    it('returns correct filters', () => {
      expect(getDefaultEventFilters({ preferences })).toEqual({
        competitions: [],
        dateRange: {
          start_date: '2020-01-31T00:00:00+00:00',
          end_date: '2020-03-27T23:59:59+00:00',
        },
        eventTypes: [],
        gameDays: [],
        include_match_monitors: true,
        oppositions: [],
        search_expression: '',
        round_number: '',
      });
    });
  });
});
