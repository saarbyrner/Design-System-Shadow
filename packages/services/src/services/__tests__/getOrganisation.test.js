import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getOrganisation';

import $ from 'jquery';
import getOrganisation from '../getOrganisation';

describe('getOrganisation', () => {
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
    const returnedData = await getOrganisation(1);

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/organisation/organisations/1',
    });
  });

  it('calls the correct endpoint when not passing an organisation id', async () => {
    await getOrganisation();
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/organisation/organisations/current',
    });
  });
});
