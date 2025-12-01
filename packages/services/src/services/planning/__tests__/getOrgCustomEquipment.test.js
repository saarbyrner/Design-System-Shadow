import $ from 'jquery';
import getOrgCustomEquipment from '../getOrgCustomEquipment';

describe('getOrgCustomEquipment', () => {
  const mockedData = [
    {
      id: 1,
      name: 'Equipment 1',
    },
    {
      id: 2,
      name: 'Equipment 2',
    },
  ];

  let getOrgCustomEquipmentRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getOrgCustomEquipmentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOrgCustomEquipment();

    expect(returnedData).toEqual(mockedData);

    expect(getOrgCustomEquipmentRequest).toHaveBeenCalledTimes(1);
    expect(getOrgCustomEquipmentRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/nfl_equipment',
    });
  });
});
