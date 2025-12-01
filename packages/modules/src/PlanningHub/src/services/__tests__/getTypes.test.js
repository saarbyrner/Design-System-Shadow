import $ from 'jquery';
import getTypes from '../getTypes';

const mockedData = [
  {
    id: 1,
    name: 'Technical',
  },
  {
    id: 2,
    name: 'Tactical',
  },
];

describe('getTypes', () => {
  let getTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getTypes();

    expect(returnedData).toEqual(mockedData);

    expect(getTypesRequest).toHaveBeenCalledTimes(1);
    expect(getTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/principle_types',
    });
  });
});
