import { axios } from '@kitman/common/src/utils/services';
import { eventsUsersOrder } from '../eventsUsersOrder';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('eventsUsersOrder', () => {
  const mockEventId = 1;
  const mockUsersOrder = [
    { id: 1, user: { id: 1, name: 'User 1' } },
    { id: 2, user: { id: 2, name: 'User 2' } },
  ];
  const mockResponse = { data: 'response data' };

  beforeEach(() => {
    axios.post.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call axios.post with the correct URL and payload', async () => {
    const result = await eventsUsersOrder({
      eventId: mockEventId,
      usersOrder: mockUsersOrder,
    });

    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${mockEventId}/events_users/bulk_save`,
      {
        event_id: mockEventId,
        users_order: mockUsersOrder,
      }
    );
    expect(result).toBe(mockResponse.data);
  });

  it('should handle errors thrown by axios.post', async () => {
    const mockError = new Error('Network Error');
    axios.post.mockRejectedValue(mockError);

    await expect(
      eventsUsersOrder({
        eventId: mockEventId,
        usersOrder: mockUsersOrder,
      })
    ).rejects.toThrow('Network Error');
  });
});
