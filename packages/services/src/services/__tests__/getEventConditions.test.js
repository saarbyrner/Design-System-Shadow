import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getEventConditions';

import $ from 'jquery';
import getEventConditions from '../getEventConditions';

describe('getEventConditions', () => {
  let getEventConditionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventConditionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventConditions();

    expect(returnedData).toEqual(serverResponse);

    expect(getEventConditionsRequest).toHaveBeenCalledTimes(1);
    expect(getEventConditionsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/event_conditions',
    });
  });
});
