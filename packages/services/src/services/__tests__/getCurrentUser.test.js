import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/getCurrentUser';

import getCurrentUser from '../getCurrentUser';

describe('getInitialData', () => {
  let getCurrentUserRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getCurrentUserRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCurrentUser();

    expect(returnedData).toEqual(serverResponse);

    expect(getCurrentUserRequest).toHaveBeenCalledTimes(1);
    expect(getCurrentUserRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/current_user',
    });
  });
});
