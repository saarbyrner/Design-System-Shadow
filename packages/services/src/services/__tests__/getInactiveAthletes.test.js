import $ from 'jquery';
import getInactiveAthletes from '../getInactiveAthletes';
import { inactiveData as data } from '../../mocks/handlers/getSquadAthletes';

describe('getInactiveAthletes', () => {
  let getInactiveAthletesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getInactiveAthletesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getInactiveAthletes();
    expect(returnedData).toEqual(data);

    expect(getInactiveAthletesRequest).toHaveBeenCalledTimes(1);
    expect(getInactiveAthletesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/squad_athletes/athlete_list',
      contentType: 'application/json',
      data: {
        inactive: true,
        include_previous_organisation_information: true,
        include_organisation_transfer_records: true,
      },
    });
  });
});
