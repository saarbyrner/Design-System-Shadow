import serverResponse from '@kitman/services/src/mocks/handlers/getSquadAthletes/byIdData.mock';

import $ from 'jquery';
import getSquadAthletesById from '../getSquadAthletesById';

describe('getSquadAthletesById', () => {
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
    const returnedData = await getSquadAthletesById(1);

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/squad_athletes/1',
    });
  });
});
