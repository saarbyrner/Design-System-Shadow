import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/getPresentationTypes';

import $ from 'jquery';
import getPresentationTypes from '../medical/getPresentationTypes';

describe('getPresentationTypes', () => {
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
    const returnedData = await getPresentationTypes();

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/presentation_types',
    });
  });
});
