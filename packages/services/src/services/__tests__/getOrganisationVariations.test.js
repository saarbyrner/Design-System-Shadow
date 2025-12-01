import serverResponse from '@kitman/services/src/mocks/handlers/rehab/getOrganisationVariations';

import $ from 'jquery';
import getOrganisationVariations from '../rehab/getOrganisationVariations';

describe('getOrganisationVariations', () => {
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
    const returnedData = await getOrganisationVariations();

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      contentType: 'application/json',
      url: '/ui/organisation_exercise_variations',
    });
  });
});
