import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/searchOrgAthletes';
import { TRADE } from '@kitman/modules/src/UserMovement/shared/constants';

import searchOrgAthletes, { searchOrgAthletesURL } from '../searchOrgAthletes';

describe('searchOrgAthletes', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchOrgAthletes('kev');

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(searchOrgAthletesURL, {
      search_expression: 'kev',
      transfer_type: TRADE,
    });
  });
});
