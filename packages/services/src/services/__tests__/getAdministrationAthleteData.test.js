import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import getAdministrationAthleteData from '../getAdministrationAthleteData';

describe('getAdministrationAthleteData', () => {
  let getAdministrationAthleteDataRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAdministrationAthleteDataRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAdministrationAthleteData({
      active: true,
    });
    expect(returnedData).toEqual(serverResponse);

    expect(getAdministrationAthleteDataRequest).toHaveBeenCalledTimes(1);
    expect(getAdministrationAthleteDataRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/administration/athletes',
      data: {
        active: true,
        page: 10,
        per_page: 1,
      },
    });
  });
});
