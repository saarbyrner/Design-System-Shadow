import { axios } from '@kitman/common/src/utils/services';
import {
  generalData,
  sessionData,
  gameData,
} from '@kitman/services/src/mocks/handlers/planning/getEventLocations';
import getEventLocations, {
  eventLocationsRequestUrl,
  eventTypePermaIds,
} from '@kitman/services/src/services/planning/getEventLocations';

describe('getEventLocations', () => {
  let getEventLocationsRequest;
  const constantParams = {
    per_page: 50,
    page: 1,
    paginate: true,
  };

  beforeAll(() => {
    getEventLocationsRequest = jest
      .spyOn(axios, 'get')
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          return resolve({ data: generalData });
        });
      })
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          return resolve({ data: sessionData });
        });
      })
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          return resolve({ data: gameData });
        });
      });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventLocations({});
    expect(returnedData).toEqual(generalData);

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getEventLocationsRequest).toHaveBeenCalledWith(
      eventLocationsRequestUrl,
      { params: { ...constantParams } }
    );
  });

  it('calls the correct endpoint for sessions', async () => {
    const returnedData = await getEventLocations({
      eventType: eventTypePermaIds.session.type,
    });
    expect(returnedData).toEqual(sessionData);

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getEventLocationsRequest).toHaveBeenCalledWith(
      eventLocationsRequestUrl,
      {
        params: {
          ...constantParams,
          event_type_perma_id: eventTypePermaIds.session.perma_id,
        },
      }
    );
  });

  it('calls the correct endpoint for games', async () => {
    const returnedData = await getEventLocations({
      eventType: eventTypePermaIds.game.type,
    });
    expect(returnedData).toEqual(gameData);

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getEventLocationsRequest).toHaveBeenCalledWith(
      eventLocationsRequestUrl,
      {
        params: {
          ...constantParams,
          event_type_perma_id: eventTypePermaIds.game.perma_id,
        },
      }
    );
  });
  it('calls the correct endpoint without passing pagination params', async () => {
    const returnedData = await getEventLocations({ paginate: false });
    expect(returnedData).toEqual(generalData);

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getEventLocationsRequest).toHaveBeenCalledWith(
      eventLocationsRequestUrl,
      { params: { paginate: false } }
    );
  });
});
