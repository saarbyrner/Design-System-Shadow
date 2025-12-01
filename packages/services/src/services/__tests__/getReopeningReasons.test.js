import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/getReopeningReasons';

import $ from 'jquery';
import getReopeningReasons from '../medical/getReopeningReasons';

describe('getReopeningReasons', () => {
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
    const returnedData = await getReopeningReasons();

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/issue_reopening_reasons',
    });
  });
});
