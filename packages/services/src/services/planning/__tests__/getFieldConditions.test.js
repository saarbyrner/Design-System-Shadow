import $ from 'jquery';
import getFieldConditions from '../getFieldConditions';

describe('getFieldConditions', () => {
  const mockedData = [
    {
      id: 11,
      name: 'Normal/Dry',
    },
    {
      id: 20,
      name: 'Frozen',
    },
  ];

  let getFieldConditionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getFieldConditionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getFieldConditions();

    expect(returnedData).toEqual(mockedData);

    expect(getFieldConditionsRequest).toHaveBeenCalledTimes(1);
    expect(getFieldConditionsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/field_conditions',
    });
  });
});
