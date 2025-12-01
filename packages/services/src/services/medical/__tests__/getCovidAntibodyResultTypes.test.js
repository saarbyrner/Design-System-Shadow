import $ from 'jquery';
import getCovidAntibodyResultTypes from '../getCovidAntibodyResultTypes';

describe('getCovidAntibodyResultTypes', () => {
  let getCovidAntibodyResultTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = ['Detected', 'Not Detected', 'TNP', 'QNS', 'Cancelled'];

    getCovidAntibodyResultTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCovidAntibodyResultTypes();

    expect(returnedData).toEqual([
      'Detected',
      'Not Detected',
      'TNP',
      'QNS',
      'Cancelled',
    ]);

    expect(getCovidAntibodyResultTypesRequest).toHaveBeenCalledTimes(1);
    expect(getCovidAntibodyResultTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/diagnostics/covid_antibody_result_types',
    });
  });
});
