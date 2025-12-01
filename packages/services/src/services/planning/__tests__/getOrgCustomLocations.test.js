import $ from 'jquery';
import getOrgCustomLocations from '../getOrgCustomLocations';

describe('getOrgCustomLocations', () => {
  const mockedData = [
    {
      id: 1,
      name: 'Venue 1',
      default_surface_type_id: 1,
    },
    {
      id: 2,
      name: 'Venue 2',
      default_surface_type_id: 3,
    },
  ];

  let getOrgCustomLocationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getOrgCustomLocationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOrgCustomLocations();

    expect(returnedData).toEqual(mockedData);

    expect(getOrgCustomLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getOrgCustomLocationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/nfl_locations',
    });
  });
});
