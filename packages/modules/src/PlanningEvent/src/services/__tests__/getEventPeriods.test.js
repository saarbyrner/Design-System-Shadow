import $ from 'jquery';
import { getEventPeriods } from '../eventPeriods';

describe('getEventPeriods', () => {
  const mockEventPeriods = [
    {
      id: 1,
      name: 'event name',
      duration: 10,
      order: 1,
    },
  ];

  let getEventPeriodsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventPeriodsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockEventPeriods));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventPeriods({ eventId: 1 });

    expect(returnedData).toEqual(mockEventPeriods);

    expect(getEventPeriodsRequest).toHaveBeenCalledTimes(1);
    expect(getEventPeriodsRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'GET',
      url: '/ui/planning_hub/events/1/game_periods',
    });
  });

  it('calls the correct endpoint and returns the correct value as supervisor view', async () => {
    const returnedData = await getEventPeriods({
      eventId: 1,
      supervisorView: true,
    });

    expect(returnedData).toEqual(mockEventPeriods);

    expect(getEventPeriodsRequest).toHaveBeenCalledTimes(1);
    expect(getEventPeriodsRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'GET',
      url: '/ui/planning_hub/events/1/game_periods?supervisor_view=true',
    });
  });
});
