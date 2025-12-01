import $ from 'jquery';
import getAthleteMedications from '../getAthleteMedications';

describe('getAthleteMedications', () => {
  let getAthleteMedicationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = { url: 'https://drfirst.com/athlete/21/sample/auth/link' };

    getAthleteMedicationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getAthleteMedications(21);

    expect(returnedData).toEqual({
      url: 'https://drfirst.com/athlete/21/sample/auth/link',
    });

    expect(getAthleteMedicationsRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteMedicationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/drfirst/portal_url?athlete_id=21',
    });
  });
});
