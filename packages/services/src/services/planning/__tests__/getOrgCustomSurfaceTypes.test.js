import $ from 'jquery';
import getOrgCustomSurfaceTypes from '../getOrgCustomSurfaceTypes';

describe('getOrgCustomSurfaceTypes', () => {
  const mockedData = [
    {
      id: 1,
      name: 'Surface 1',
    },
    {
      id: 2,
      name: 'Surface 2',
    },
  ];

  let getOrgCustomSurfaceTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getOrgCustomSurfaceTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOrgCustomSurfaceTypes();

    expect(returnedData).toEqual(mockedData);

    expect(getOrgCustomSurfaceTypesRequest).toHaveBeenCalledTimes(1);
    expect(getOrgCustomSurfaceTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/nfl_surfaces',
    });
  });
});
