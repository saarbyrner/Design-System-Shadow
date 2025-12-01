import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getInternationalPhonePrefixes';

import $ from 'jquery';
import getInternationalPhonePrefixes from '../getInternationalPhonePrefixes';

describe('getInternationalPhonePrefixes', () => {
  let request;

  beforeEach(() => {
    const deferred = $.Deferred();
    request = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getInternationalPhonePrefixes();

    expect(returnedData).toEqual(serverResponse.country_codes);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/country_codes',
    });
  });
});
