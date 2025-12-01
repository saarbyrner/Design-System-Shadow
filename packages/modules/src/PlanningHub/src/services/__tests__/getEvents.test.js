import $ from 'jquery';
import getEvents from '../getEvents';

const mockedData = { events: [], next_id: 50 };
const eventFilters = {
  dateRange: {
    start_date: '2021-02-05T10:12:58+00:00',
    end_date: '2021-01-09T10:12:58+00:00',
  },
  eventTypes: ['game_event'],
  competitions: [3, 1],
  gameDays: ['+7'],
  oppositions: [14, 2],
};

describe('getEvents', () => {
  let getEventsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const assertRequestData = (returnedData, expectedRequestData) => {
    expect(returnedData).toEqual(mockedData);
    expect(getEventsRequest).toHaveBeenCalledWith(expectedRequestData);
  };

  it('should call the correct endpoint and return the expected data', async () => {
    const returnedData = await getEvents(eventFilters, 5);

    const expectedRequestData = {
      method: 'POST',
      url: '/planning_hub/events/search',
      contentType: 'application/json',
      data: JSON.stringify({
        date_range: eventFilters.dateRange,
        event_types: eventFilters.eventTypes,
        competitions: eventFilters.competitions,
        game_days: eventFilters.gameDays,
        oppositions: eventFilters.oppositions,
        search_expression: '',
        include_game_status: false,
        next_id: 5,
        squad_names: [],
        statuses: [],
        organisations: [],
        supervisor_view: false,
        start_time_asc: false,
        recurring_events: false,
        include_user_event_requests_counts: false,
        round_number: '',
        include_division: false,
      }),
    };

    assertRequestData(returnedData, expectedRequestData);
  });

  it('should call the correct endpoint and return the correct value with user_event_requests info', async () => {
    const returnedData = await getEvents(
      { ...eventFilters, user_event_requests_statuses: [] },
      5
    );

    const expectedRequestData = {
      method: 'POST',
      url: '/planning_hub/events/search',
      contentType: 'application/json',
      data: JSON.stringify({
        date_range: eventFilters.dateRange,
        event_types: eventFilters.eventTypes,
        competitions: eventFilters.competitions,
        game_days: eventFilters.gameDays,
        oppositions: eventFilters.oppositions,
        search_expression: '',
        include_game_status: false,
        next_id: 5,
        squad_names: [],
        statuses: [],
        organisations: [],
        supervisor_view: false,
        start_time_asc: false,
        recurring_events: false,
        include_user_event_requests_counts: false,
        round_number: '',
        include_division: false,
        user_event_requests_statuses: [],
      }),
    };

    assertRequestData(returnedData, expectedRequestData);
  });

  it('should include division when include_division is true', async () => {
    const filtersWithDivision = {
      ...eventFilters,
      include_division: true,
    };

    const returnedData = await getEvents(filtersWithDivision, 5);

    const expectedRequestData = {
      method: 'POST',
      url: '/planning_hub/events/search',
      contentType: 'application/json',
      data: JSON.stringify({
        date_range: eventFilters.dateRange,
        event_types: eventFilters.eventTypes,
        competitions: eventFilters.competitions,
        game_days: eventFilters.gameDays,
        oppositions: eventFilters.oppositions,
        search_expression: '',
        include_game_status: false,
        next_id: 5,
        squad_names: [],
        statuses: [],
        organisations: [],
        supervisor_view: false,
        start_time_asc: false,
        recurring_events: false,
        include_user_event_requests_counts: false,
        round_number: '',
        include_division: true,
      }),
    };

    assertRequestData(returnedData, expectedRequestData);
  });

  describe('assign match official panel', () => {
    const assignMatchOfficialFilters = {
      ...eventFilters,
      include_division: true,
    };

    it('calls the correct endpoint and returns the correct values', async () => {
      const returnedData = await getEvents(assignMatchOfficialFilters, 5);

      const expectedRequestData = {
        method: 'POST',
        url: '/planning_hub/events/search',
        contentType: 'application/json',
        data: JSON.stringify({
          date_range: eventFilters.dateRange,
          event_types: eventFilters.eventTypes,
          competitions: eventFilters.competitions,
          game_days: eventFilters.gameDays,
          oppositions: eventFilters.oppositions,
          search_expression: '',
          include_game_status: false,
          next_id: 5,
          squad_names: [],
          statuses: [],
          organisations: [],
          supervisor_view: false,
          start_time_asc: false,
          recurring_events: false,
          include_user_event_requests_counts: false,
          round_number: '',
          include_division: true,
        }),
      };

      assertRequestData(returnedData, expectedRequestData);
    });
  });

  describe('Match day flow', () => {
    const dmnAndDmrFilters = {
      ...eventFilters,
      include_kit_matrix: true,
      include_game_kit_matrix: true,
      include_home_dmr: true,
      include_away_dmr: true,
      include_time: true,
      include_game_participants_lock_time: true,
      include_match_director: true,
      include_tv_channels: false,
      include_tv_game_contacts: false,
    };

    it('calls the correct endpoint and returns the correct values', async () => {
      const returnedData = await getEvents(dmnAndDmrFilters, 5);

      const expectedRequestData = {
        contentType: 'application/json',
        data: JSON.stringify({
          date_range: eventFilters.dateRange,
          event_types: eventFilters.eventTypes,
          competitions: eventFilters.competitions,
          game_days: eventFilters.gameDays,
          oppositions: eventFilters.oppositions,
          search_expression: '',
          include_game_status: false,
          next_id: 5,
          squad_names: [],
          statuses: [],
          organisations: [],
          supervisor_view: false,
          start_time_asc: false,
          recurring_events: false,
          include_user_event_requests_counts: false,
          round_number: '',
          include_division: false,
          include_kit_matrix: true,
          include_game_kit_matrix: true,
          include_time: true,
          include_home_dmr: true,
          include_away_dmr: true,
          include_game_participants_lock_time: true,
          include_match_director: true,
        }),
        method: 'POST',
        url: '/planning_hub/events/search',
      };

      assertRequestData(returnedData, expectedRequestData);
    });
  });

  describe('match monitor filters', () => {
    const matchMonitorFilters = {
      ...eventFilters,
      include_match_monitors: true,
    };

    it('calls the correct endpoint and returns the correct values', async () => {
      const returnedData = await getEvents(matchMonitorFilters, 5);

      const expectedRequestData = {
        contentType: 'application/json',
        data: JSON.stringify({
          date_range: eventFilters.dateRange,
          event_types: eventFilters.eventTypes,
          competitions: eventFilters.competitions,
          game_days: eventFilters.gameDays,
          oppositions: eventFilters.oppositions,
          search_expression: '',
          include_game_status: false,
          next_id: 5,
          squad_names: [],
          statuses: [],
          organisations: [],
          supervisor_view: false,
          start_time_asc: false,
          recurring_events: false,
          include_user_event_requests_counts: false,
          round_number: '',
          include_division: false,
          include_match_monitors: true,
          include_game_monitor_report_submitted: true,
        }),
        method: 'POST',
        url: '/planning_hub/events/search',
      };

      assertRequestData(returnedData, expectedRequestData);
    });
  });
  describe('scout access management filters', () => {
    const scoutAccessFilters = {
      ...eventFilters,
      include_access_request_accessible: true,
      include_access_request_time_valid: true,
      includeUserEventRequestsCounts: true,
      include_scout_attendees: true,
    };

    it('calls the correct endpoint and returns the correct values', async () => {
      const returnedData = await getEvents(scoutAccessFilters, 5);

      const expectedRequestData = {
        contentType: 'application/json',
        data: JSON.stringify({
          date_range: eventFilters.dateRange,
          event_types: eventFilters.eventTypes,
          competitions: eventFilters.competitions,
          game_days: eventFilters.gameDays,
          oppositions: eventFilters.oppositions,
          search_expression: '',
          include_game_status: false,
          next_id: 5,
          squad_names: [],
          statuses: [],
          organisations: [],
          supervisor_view: false,
          start_time_asc: false,
          recurring_events: false,
          include_user_event_requests_counts: true,
          round_number: '',
          include_division: false,
          include_scout_attendees: true,
          include_access_request_accessible: true,
          include_access_request_time_valid: true,
        }),
        method: 'POST',
        url: '/planning_hub/events/search',
      };

      assertRequestData(returnedData, expectedRequestData);
    });
  });
});
