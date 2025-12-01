import $ from 'jquery';
import getEventAthletesGrid from '../getEventAthletesGrid';

const mockedEventAthletesGrid = {
  columns: [
    { row_key: 'athlete', name: 'Athlete' },
    { row_key: 'participation', name: 'Participation' },
  ],
  rows: [
    {
      id: 1,
      athlete: {
        availability: 'available',
        avatar_url: 'john_do_avatar.jpg',
        fullname: 'John Doh',
      },
      participation: 'Full',
    },
  ],
};

describe('getEventAthletesGrid', () => {
  let getEventAthletesGridRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventAthletesGridRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEventAthletesGrid));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventAthletesGrid({ id: 1 }, 50, {
      positions: [1],
      squads: [2, 3],
      availabilities: [7],
    });

    expect(returnedData).toEqual(mockedEventAthletesGrid);

    expect(getEventAthletesGridRequest).toHaveBeenCalledTimes(1);
    expect(getEventAthletesGridRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/athlete_tab',
      contentType: 'application/json',
      data: JSON.stringify({
        filters: {
          positions: [1],
          squads: [2, 3],
          availabilities: [7],
        },
        next_id: 50,
      }),
    });
  });
});
