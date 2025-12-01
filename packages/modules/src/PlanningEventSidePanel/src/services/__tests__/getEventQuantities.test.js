import { axios } from '@kitman/common/src/utils/services';
import getEventQuantities from '../getEventQuantities';

const mockedEventQuantities = {
  setlist: {
    metadata: {
      id: 2,
      name: 'Training session workload',
      description: 'Global setlist for rugby union training session workloads',
      sport_id: 2,
      level: 'event',
    },
    units: [
      {
        id: 10298,
        name: 'Scrums',
        description: 'Number of rugby scrums',
        perma_id: 'rugby_scrums',
        variable_type_id: 1,
        min: 0,
        max: null,
        invert_scale: false,
        unit: null,
        rounding_places: 0,
        default: null,
      },
      {
        id: 10300,
        name: 'Rucks',
        description: 'Number of rugby rucks',
        perma_id: 'rugby_rucks',
        variable_type_id: 1,
        min: 0,
        max: null,
        invert_scale: false,
        unit: null,
        rounding_places: 0,
        default: null,
      },
    ],
  },
};

describe('getEventQuantities service', () => {
  let getEventQuantitiesRequest;

  beforeEach(() => {
    getEventQuantitiesRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() =>
        Promise.resolve({ data: mockedEventQuantities })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with game and returns the correct value', async () => {
    const returnedData = await getEventQuantities('game', 1);

    expect(returnedData).toEqual(mockedEventQuantities);

    expect(getEventQuantitiesRequest).toHaveBeenCalledTimes(1);
    expect(getEventQuantitiesRequest).toHaveBeenCalledWith(
      '/workloads/events/event_quantities',
      {
        event_type: 'game',
        squad_id: 1,
      }
    );
  });

  it('calls the correct endpoint with session and returns the correct value', async () => {
    const returnedData = await getEventQuantities('session', 1);

    expect(returnedData).toEqual(mockedEventQuantities);

    expect(getEventQuantitiesRequest).toHaveBeenCalledTimes(1);
    expect(getEventQuantitiesRequest).toHaveBeenCalledWith(
      '/workloads/events/event_quantities',
      {
        event_type: 'session',
        squad_id: 1,
      }
    );
  });
});
