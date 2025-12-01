import $ from 'jquery';
import { data as mockedData } from '@kitman/services/src/mocks/handlers/exports/getExportBilling';
import getExportBilling from '../getExportBilling';

describe('getExportBilling', () => {
  let getExportBillingRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getExportBillingRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getExportBilling({
      nextPage: 1,
      itemsPerPage: 25,
    });
    expect(returnedData).toEqual(mockedData);

    expect(getExportBillingRequest).toHaveBeenCalledTimes(1);
    expect(getExportBillingRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/export_jobs',
      data: {
        export_type: null,
        page: 1,
        per_page: 25,
        status: null,
      },
    });
  });
});
