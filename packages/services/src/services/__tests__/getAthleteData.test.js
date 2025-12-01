import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '../../mocks/handlers/getAthleteData';
import getAthleteData from '../getAthleteData';

describe('getAthleteData', () => {
  let getAthleteDataRequest;

  beforeEach(() => {
    getAthleteDataRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthleteData(1);

    expect(returnedData).toEqual(serverResponse);

    expect(getAthleteDataRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteDataRequest).toHaveBeenCalledWith('/medical/athletes/1', {
      headers: { Accept: 'application/json' },
    });
  });
});
