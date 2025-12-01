import $ from 'jquery';
import getAthletes from '../getAthletes';
import { athletesMocked } from '../../utils/mocks';

describe('getAthletes', () => {
  let getAthletesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAthletesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(athletesMocked));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthletes();
    expect(returnedData).toEqual(athletesMocked);

    expect(getAthletesRequest).toHaveBeenCalledTimes(1);
    expect(getAthletesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes.json',
      dataType: 'json',
    });
  });
});
