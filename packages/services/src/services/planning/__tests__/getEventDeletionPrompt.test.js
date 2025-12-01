import { axios } from '@kitman/common/src/utils/services';
import { data as mockResponse } from '@kitman/services/src/mocks/handlers/planningHub/getEventDeletionPrompt';

import getEventDeletionPrompt from '../getEventDeletionPrompt';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('getEventDeletionPrompt', () => {
  it('should return the correct data when the request succeeds with default params', async () => {
    const params = {
      eventId: 1,
      eventScope: undefined,
      isRepeatEvent: false,
    };
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getEventDeletionPrompt(params);

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(
      `/ui/planning_hub/event_deletion_prompt?event_id=${params.eventId}`
    );
  });

  it('should return the correct data when the request succeeds with eventScope param', async () => {
    const params = {
      eventId: 1,
      eventScope: 'this',
      isRepeatEvent: true,
    };
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getEventDeletionPrompt(params);

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(
      `/ui/planning_hub/event_deletion_prompt?event_id=${params.eventId}&scope=${params.eventScope}`
    );
  });

  it('should throw an error when the request fails', async () => {
    const params = {
      eventId: 1,
      eventScope: undefined,
      isRepeatEvent: false,
    };
    axios.get = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(getEventDeletionPrompt(params)).rejects.toThrow(
      'Request failed'
    );
  });
});
