import { axios } from '@kitman/common/src/utils/services';
import saveAncillaryRange from '../saveAncillaryRange';

jest.mock('axios');

describe('saveAncillaryRange', () => {
  const requestData = {
    athleteId: 1234,
    movementType: 'Try-Out',
    start_date: new Date('2023-01-01T00:00:00Z'),
    end_date: new Date('2023-06-01T00:00:00Z'),
  };

  it('calls the correct endpoint and returns the correct value', async () => {
    const mockResponse = { data: true };

    jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

    const returnedData = await saveAncillaryRange(requestData);
    expect(returnedData).toEqual(true);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/medical/athletes/${requestData.athleteId}/ancillary_dates`,
      {
        start_date: requestData.start_date,
        end_date: requestData.end_date,
        type: requestData.movementType,
      }
    );
  });

  it('handles error response correctly', async () => {
    const mockError = {
      response: {
        data: false,
      },
    };

    jest.spyOn(axios, 'post').mockRejectedValue(mockError);

    await expect(saveAncillaryRange(requestData)).rejects.toEqual(mockError);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/medical/athletes/${requestData.athleteId}/ancillary_dates`,
      {
        start_date: requestData.start_date,
        end_date: requestData.end_date,
        type: requestData.movementType,
      }
    );
  });
});
