import $ from 'jquery';
import getOrderProviders from '../getOrderProviders';

describe('getOrderProviders', () => {
  let getOrderProvidersRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = [
      {
        sgid: 1236,
        fullname: "Stuart O'Brien",
      },
      {
        sgid: 1239,
        fullname: 'Stephen Smith',
      },
      {
        sgid: 1571,
        fullname: 'Rod Murphy',
      },
    ];

    getOrderProvidersRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOrderProviders({
      locationId: 999,
      activeUsersOnly: true,
      npi: true,
    });

    expect(returnedData).toEqual([
      {
        sgid: 1236,
        fullname: "Stuart O'Brien",
      },
      {
        sgid: 1239,
        fullname: 'Stephen Smith',
      },
      {
        sgid: 1571,
        fullname: 'Rod Murphy',
      },
    ]);

    expect(getOrderProvidersRequest).toHaveBeenCalledTimes(1);
    expect(getOrderProvidersRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/location_providers',
      data: {
        location_id: 999,
        is_active: true,
        npi: true,
      },
    });
  });
});
