import $ from 'jquery';
import getCovidResultTypes from '../getCovidResultTypes';

describe('getCovidResultTypes', () => {
  let getCovidResultTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = [
      'Not Detected',
      'Positive for 2019-nCoV',
      'Invalid',
      'Inconclusive',
      'Presumptive Positive for 2019-nCoV',
      'TNP',
      'QNS',
      'Cancelled',
    ];

    getCovidResultTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCovidResultTypes();

    expect(returnedData).toEqual([
      'Not Detected',
      'Positive for 2019-nCoV',
      'Invalid',
      'Inconclusive',
      'Presumptive Positive for 2019-nCoV',
      'TNP',
      'QNS',
      'Cancelled',
    ]);

    expect(getCovidResultTypesRequest).toHaveBeenCalledTimes(1);
    expect(getCovidResultTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/diagnostics/covid_result_types',
    });
  });
});
