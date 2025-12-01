import $ from 'jquery';
import getAthleteEvents from '../getAthleteEvents';

const mockedAthleteEvents = {
  athlete_events: [{ id: 1461 }, { id: 1462 }],
};

describe('getAthleteEvents', () => {
  let getAthleteEventsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAthleteEventsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAthleteEvents));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthleteEvents(1);

    expect(returnedData).toEqual(mockedAthleteEvents);

    expect(getAthleteEventsRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: false,
        include_position_group: false,
        include_squad_name: false,
        include_squad_number: false,
        force_latest: false,
      },
    });
  });

  it('calls the correct endpoint with the correct params', async () => {
    await getAthleteEvents(1, { includeSquadName: true });
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: false,
        include_position_group: false,
        include_squad_name: true,
        include_squad_number: false,
        force_latest: false,
      },
    });

    await getAthleteEvents(1, { includeSquadNumber: true });
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: false,
        include_position_group: false,
        include_squad_name: false,
        include_squad_number: true,
        force_latest: false,
      },
    });

    await getAthleteEvents(1, { includePositionGroup: true });
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: false,
        include_position_group: true,
        include_squad_name: false,
        include_squad_number: false,
        force_latest: false,
      },
    });

    await getAthleteEvents(1, { includeDesignation: true });
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: true,
        include_position_group: false,
        include_squad_name: false,
        include_squad_number: false,
        force_latest: false,
      },
    });

    await getAthleteEvents(1, {
      includeSquadName: true,
      includeSquadNumber: true,
      includePositionGroup: true,
      includeDesignation: true,
      forceLatest: true,
    });
    expect(getAthleteEventsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/athlete_events',
      contentType: 'application/json',
      data: {
        include_designation: true,
        include_position_group: true,
        include_squad_name: true,
        include_squad_number: true,
        force_latest: true,
      },
    });
  });
});
