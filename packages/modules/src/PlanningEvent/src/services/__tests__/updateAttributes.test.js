import $ from 'jquery';
import updateAttributes from '../updateAttributes';

const mockedAttributes = {
  rows: [],
  columns: [],
  next_id: [],
};

describe('updateAttributes', () => {
  let updateAttributesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateAttributesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAttributes));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateAttributes({
      eventId: 1,
      attributes: { participation: 'full' },
      athleteId: 'athlete_1',
      filters: {
        positions: [],
        squads: [],
        availabilities: [],
      },
      tab: 'athletes_tab',
    });

    expect(returnedData).toEqual(mockedAttributes);

    expect(updateAttributesRequest).toHaveBeenCalledTimes(1);
    expect(updateAttributesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/athlete_events/update_attributes',
      contentType: 'application/json',
      data: JSON.stringify({
        participation: 'full',
        athlete_id: 'athlete_1',
        filters: {
          positions: [],
          squads: [],
          availabilities: [],
        },
        tab: 'athletes_tab',
      }),
    });
  });

  it('calls the correct endpoint and tab, and returns the correct value', async () => {
    const returnedData = await updateAttributes({
      eventId: 1,
      attributes: { participation: 'full' },
      athleteId: 'athlete_1',
      filters: {
        positions: [],
        squads: [],
        availabilities: [],
      },
      tab: 'collections_tab',
    });

    expect(returnedData).toEqual(mockedAttributes);

    expect(updateAttributesRequest).toHaveBeenCalledTimes(1);
    expect(updateAttributesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/athlete_events/update_attributes',
      contentType: 'application/json',
      data: JSON.stringify({
        participation: 'full',
        athlete_id: 'athlete_1',
        filters: {
          positions: [],
          squads: [],
          availabilities: [],
        },
        tab: 'collections_tab',
      }),
    });
  });
});
