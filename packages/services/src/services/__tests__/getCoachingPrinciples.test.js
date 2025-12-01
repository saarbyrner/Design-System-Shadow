import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getCoachingPrinciples';

import getAreCoachingPrinciplesEnabled from '../getAreCoachingPrinciplesEnabled';

describe('getAreCoachingPrinciplesEnabled', () => {
  let getAreCoachingPrinciplesEnabledRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAreCoachingPrinciplesEnabledRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAreCoachingPrinciplesEnabled();

    expect(returnedData).toEqual(serverResponse);

    expect(getAreCoachingPrinciplesEnabledRequest).toHaveBeenCalledTimes(1);
    expect(getAreCoachingPrinciplesEnabledRequest).toHaveBeenCalledWith({
      method: 'GET',
      contentType: 'application/json',
      url: '/organisation_preferences/coaching_principles',
    });
  });
});
