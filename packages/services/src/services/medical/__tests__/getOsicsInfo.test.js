import $ from 'jquery';
import getOsicsInfo from '../getOsicsInfo';

describe('getOsicsInfo', () => {
  let getOsicsInfoRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = {
      id: 'RFUM',
      osics_classification_id: 8,
      osics_body_area_id: 4,
    };

    getOsicsInfoRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getOsicsInfo(1, 382);

    expect(returnedData).toEqual({
      id: 'RFUM',
      osics_classification_id: 8,
      osics_body_area_id: 4,
    });

    expect(getOsicsInfoRequest).toHaveBeenCalledTimes(1);
    expect(getOsicsInfoRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/issues/osics_info',
      data: {
        id: 382,
        scope_to_org: true,
      },
    });
  });
});
