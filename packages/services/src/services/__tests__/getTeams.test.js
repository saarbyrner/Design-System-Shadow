import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getTeams';

import $ from 'jquery';
import getTeams from '../getTeams';

describe('getTeams', () => {
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
    const returnedData = await getTeams();

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/teams',
    });
  });
});
