import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import getAthletesPolicies from '../getAthletesPolicies';

describe('getAthletesPolicies', () => {
  let getAthletesPoliciesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAthletesPoliciesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthletesPolicies();
    expect(returnedData).toEqual(serverResponse);

    expect(getAthletesPoliciesRequest).toHaveBeenCalledTimes(1);
    expect(getAthletesPoliciesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/settings/athletes/export_policies?active=1',
      contentType: 'application/json',
    });
  });
});
