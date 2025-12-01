import $ from 'jquery';
import getMedicalLocations from '../getMedicalLocations';

describe('getMedicalLocations', () => {
  let getMedicalLocationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = {
      organisation_locations: [
        {
          id: 1236,
          location: 'Melwood Training Ground',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
        {
          id: 6037,
          location: 'Anfield Road',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
        {
          id: 9726,
          location: 'Fenway Park',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
      ],
    };

    getMedicalLocationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getMedicalLocations('diagnostic');

    expect(returnedData).toEqual({
      organisation_locations: [
        {
          id: 1236,
          location: 'Melwood Training Ground',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
        {
          id: 6037,
          location: 'Anfield Road',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
        {
          id: 9726,
          location: 'Fenway Park',
          type_of: {
            name: 'diagnostic',
            value: 0,
          },
        },
      ],
    });

    expect(getMedicalLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalLocationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/locations',
      data: {
        type_of: 'diagnostic',
      },
    });
  });
});
