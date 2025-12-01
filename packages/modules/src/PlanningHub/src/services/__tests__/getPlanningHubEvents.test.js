import { axios } from '@kitman/common/src/utils/services';
import { data as mockedEvent } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';
import getPlanningHubEvent from '../getPlanningHubEvent';

const inputEvent = {
  eventId: 3692,
  originalStartTime: '2024-04-08T09:15:00.000Z',
};

describe('getPlanningHubEvent', () => {
  let getPlanningHubEventRequest;

  beforeEach(() => {
    getPlanningHubEventRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      `/planning_hub/events/3692`,
      {
        params: {},
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when showAthletes and Staff turned on', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      showAthletesAndStaff: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_event_users: true,
          include_home_athletes: true,
          include_home_event_users: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when showAthletesAndStaff and includeGraduationDate is true', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      showAthletesAndStaff: true,
      includeGraduationDate: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_event_users: true,
          include_graduation_date: true,
          include_home_athletes: true,
          include_home_event_users: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when originalStartTime is passed', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      originalStartTime: inputEvent.originalStartTime,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: { original_start_time: '2024-04-08T09:15:00.000Z' },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when originalStartTime is passed and showAthletesAndStaff is true', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      originalStartTime: inputEvent.originalStartTime,
      showAthletesAndStaff: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_event_users: true,
          include_home_athletes: true,
          include_home_event_users: true,
          original_start_time: '2024-04-08T09:15:00.000Z',
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeDmrStatus is passed', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeDmrStatus: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: { include_dmr: true },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeChildDmrStatuses is passed', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeChildDmrStatuses: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: { include_away_dmr: true, include_home_dmr: true },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeDmrBlockedTime is passed', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeDmrBlockedTime: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: { include_game_participants_lock_time: true },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeNotificationStatus is passed', async () => {
    await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeNotificationStatus: true,
    });

    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_dmn_notification_status: true,
          include_dmr_notification_status: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeTvInfo is passed', async () => {
    await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeTvInfo: true,
    });

    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_tv_channels: true,
          include_tv_game_contacts: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeRRuleInstance is passed', async () => {
    await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeRRuleInstance: true,
    });

    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_rrule_instance: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when includeDivision is passed', async () => {
    await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      includeDivision: true,
    });

    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_division: true,
        },
      }
    );
  });

  it('calls the correct endpoint and returns the correct value when all options are passed', async () => {
    const returnedData = await getPlanningHubEvent({
      eventId: inputEvent.eventId,
      originalStartTime: inputEvent.originalStartTime,
      includeGraduationDate: true,
      showAthletesAndStaff: true,
      includeDmrStatus: true,
      includeChildDmrStatuses: true,
      includeDmrBlockedTime: true,
      includeNotificationStatus: true,
      includeTvInfo: true,
      includeRRuleInstance: true,
      includeDivision: true,
    });

    expect(returnedData).toEqual(mockedEvent);
    expect(getPlanningHubEventRequest).toHaveBeenCalledTimes(1);
    expect(getPlanningHubEventRequest).toHaveBeenCalledWith(
      '/planning_hub/events/3692',
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
        params: {
          include_away_athletes: true,
          include_away_dmr: true,
          include_away_event_users: true,
          include_division: true,
          include_dmr: true,
          include_game_participants_lock_time: true,
          include_graduation_date: true,
          include_home_athletes: true,
          include_home_dmr: true,
          include_home_event_users: true,
          include_dmn_notification_status: true,
          include_dmr_notification_status: true,
          include_rrule_instance: true,
          include_tv_channels: true,
          include_tv_game_contacts: true,
          original_start_time: '2024-04-08T09:15:00.000Z',
        },
      }
    );
  });
});
