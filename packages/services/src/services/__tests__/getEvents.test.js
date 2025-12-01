import { mockData as serverResponse } from '@kitman/services/src/mocks/handlers/getEvents';
import { axios } from '@kitman/common/src/utils/services';
import getEvents from '../getEvents';

describe('getEvents', () => {
  let request;
  const abortController = new AbortController();

  const staffIds = [1];
  const athleteIds = [2, 3];
  const squadIds = [4, 5, 6];
  const competitionIds = [6, 7];
  const oppositionsIds = [4, 6];
  const venueTypeIds = [6, 8, 9];
  const locations = [
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];
  const locationIds = [2, 3];

  const stateMock = {
    calendarPage: {
      calendarFilters: {
        squadSessionsFilter: true,
        individualSessionsFilter: true,
        gamesFilter: true,
        treatmentsFilter: false,
        rehabFilter: false,
        customEventsFilter: true,
      },
      squadSelection: {
        athletes: [],
      },
    },
    calendarFilters: {
      staff: staffIds,
      athletes: athleteIds,
      squads: squadIds,
      competitions: competitionIds,
      oppositions: oppositionsIds,
      venueTypes: venueTypeIds,
      locationNames: locations,
      types: ['gamesFilter', 'treatmentsFilter', 'customEventsFilter'],
    },
  };

  const startDateMock = '2023-06-26T00:00:00+01:00';
  const endDateMock = '2023-08-07T00:00:00+01:00';

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint and returns the correct default values', async () => {
    const mockRequest = {
      athlete_ids: undefined,
      end: '2023-08-07T00:00:00+01:00',
      games: 'true',
      individual_sessions: 'true',
      rehab: undefined,
      squad_sessions: 'true',
      start: '2023-06-26T00:00:00+01:00',
      treatments: undefined,
      custom_events: undefined,
    };

    const response = await getEvents(
      stateMock,
      startDateMock,
      endDateMock,
      abortController.signal
    );

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/calendar/events', mockRequest, {
      signal: abortController.signal,
    });
  });

  it('should call the correct endpoint with values if feature flags are enabled', async () => {
    const mockRequestWithFFValues = {
      end: '2023-08-07T00:00:00+01:00',
      games: 'true',
      individual_sessions: 'false',
      rehab: 'false',
      squad_sessions: 'false',
      start: '2023-06-26T00:00:00+01:00',
      treatments: 'true',
      custom_events: 'true',
      athlete_ids: athleteIds,
      competition_ids: competitionIds,
      location_ids: locationIds,
      oppositions_ids: oppositionsIds,
      squad_ids: squadIds,
      user_ids: staffIds,
      venue_type_ids: venueTypeIds,
    };

    const specificTestStateMock = {
      ...stateMock,
      calendarPage: {
        ...stateMock.calendarPage,
        calendarFilters: {
          squadSessionsFilter: false,
          individualSessionsFilter: false,
          gamesFilter: false,
          treatmentsFilter: false,
          rehabFilter: false,
          customEventsFilter: false,
        },
      },
    };

    window.featureFlags['schedule-treatments'] = true;
    window.featureFlags['schedule-rehab'] = true;
    window.featureFlags['web-calendar-athlete-filter'] = true;
    window.featureFlags['custom-events'] = true;
    window.featureFlags['optimized-calendar'] = true;

    await getEvents(
      specificTestStateMock,
      startDateMock,
      endDateMock,
      abortController.signal
    );

    expect(request).toHaveBeenCalledWith(
      '/calendar/events',
      mockRequestWithFFValues,
      { signal: abortController.signal }
    );
  });
});
