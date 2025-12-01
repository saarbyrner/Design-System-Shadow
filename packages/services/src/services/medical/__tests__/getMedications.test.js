import $ from 'jquery';
import getMedications from '../getMedications';

describe('getMedications', () => {
  let getMedicationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getMedicationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({ download_scheduled: true }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getMedications(80524);
    expect(returnedData).toEqual({ download_scheduled: true });

    expect(getMedicationsRequest).toHaveBeenCalledTimes(1);
    expect(getMedicationsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/drfirst/download_medications',
      data: {
        athlete_id: 80524,
      },
    });
  });
});
