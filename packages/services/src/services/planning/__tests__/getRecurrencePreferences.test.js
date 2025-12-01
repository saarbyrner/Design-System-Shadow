import { axios } from '@kitman/common/src/utils/services';
import { data as mockResponse } from '@kitman/services/src/mocks/handlers/planningHub/getRecurrencePreferences';

import getRecurrencePreferences from '../getRecurrencePreferences';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('getRecurrencePreferences', () => {
  it('should return the correct data when the request succeeds', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getRecurrencePreferences();

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(
      '/ui/planning_hub/events_recurrence_preferences'
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(getRecurrencePreferences()).rejects.toThrow('Request failed');
  });
});
