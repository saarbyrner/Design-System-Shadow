import {
  initialState,
  REDUCER_KEY,
} from '@kitman/modules/src/Messaging/src/redux/slices/messagingSlice';
import { getTotalUnreadCount } from '..';

describe('getTotalUnreadCount selector', () => {
  it('returns totalUnread from messaging slice when state exists', () => {
    const mockState = {
      [REDUCER_KEY]: {
        totalUnread: 5,
        conversationMap: {},
      },
    };

    const result = getTotalUnreadCount(mockState);

    expect(result).toBe(5);
  });

  it('returns totalUnread from initialState when messaging slice is missing', () => {
    const mockState = {
      conversationMap: {},
    };

    const result = getTotalUnreadCount(mockState);

    expect(result).toBe(initialState.totalUnread);
  });
});
