import { NOTIFICATION_LEVEL } from '@kitman/modules/src/Messaging/src/types';
import {
  getAuthorColourNumber,
  getChatIdentityForUser,
  getDirectMessageChannelUniqueName,
  correctReadMessageIndex,
  countUnreadMessages,
  updateNotificationLevel,
} from '../utils';

describe('Chat Utils correctReadMessageIndex', () => {
  it('returns the lastReadMessageIndex when not too large', async () => {
    const updateLastReadMessageIndex = jest.fn();

    const mockConversation = {
      lastMessage: { index: 2 },
      lastReadMessageIndex: 1,
      updateLastReadMessageIndex,
    };
    expect(await correctReadMessageIndex(mockConversation)).toBe(1);
    expect(updateLastReadMessageIndex).not.toHaveBeenCalled();
  });

  it('corrects a last read index that is too large', async () => {
    const updateLastReadMessageIndex = jest.fn();

    const mockConversation = {
      lastMessage: { index: 2 },
      lastReadMessageIndex: 100,
      updateLastReadMessageIndex,
    };
    expect(await correctReadMessageIndex(mockConversation)).toBe(2);
    expect(updateLastReadMessageIndex).toHaveBeenCalledWith(2);
  });

  it('returns zero when lastMessage not present', async () => {
    const updateLastReadMessageIndex = jest.fn();

    const mockConversation = {
      lastReadMessageIndex: 10,
      updateLastReadMessageIndex,
    };
    expect(await correctReadMessageIndex(mockConversation)).toBe(0);
    expect(updateLastReadMessageIndex).toHaveBeenCalledWith(0);
  });
  it('returns -1 when lastReadMessageIndex is null', async () => {
    const updateLastReadMessageIndex = jest.fn();

    const mockConversation = {
      lastReadMessageIndex: null,
      updateLastReadMessageIndex,
    };
    expect(await correctReadMessageIndex(mockConversation)).toBe(-1);
    expect(updateLastReadMessageIndex).not.toHaveBeenCalledWith();
  });
});

describe('Chat Utils getAuthorColourNumber', () => {
  it('consistently hashes author identity to a number', () => {
    expect(getAuthorColourNumber('6||97443')).toBe(8);
    expect(getAuthorColourNumber('6||2942')).toBe(10);
    expect(getAuthorColourNumber('6||31602')).toBe(3);
    expect(getAuthorColourNumber('6||97529')).toBe(3);
    expect(getAuthorColourNumber('6||103191')).toBe(10);
    expect(getAuthorColourNumber('6||103581')).toBe(7);
  });
});

describe('Chat Utils getChatIdentityForUser', () => {
  it('creates the correct format', () => {
    expect(getChatIdentityForUser('6', '97443')).toBe('6||97443');
  });
});

describe('Chat Utils getDirectMessageChannelUniqueName', () => {
  it('creates the correct format by sorting the inputs', () => {
    expect(getDirectMessageChannelUniqueName('6||A', '6||B')).toBe(
      '6||A__6||B'
    );
    expect(getDirectMessageChannelUniqueName('6||B', '6||A')).toBe(
      '6||A__6||B'
    );
    expect(getDirectMessageChannelUniqueName('6||Z', '6||A')).toBe(
      '6||A__6||Z'
    );
  });

  describe('Chat Utils countUnreadMessages', () => {
    it('returns correct counts when messages are unread', async () => {
      const mockConversation = {
        lastMessage: { index: 5 },
        lastReadMessageIndex: 2,
        updateLastReadMessageIndex: jest.fn(),
      };

      const result = await countUnreadMessages(mockConversation);

      expect(result).toEqual({
        lastMessageIndex: 5,
        lastReadMessageIndex: 2,
        unreadMessagesCount: 3,
      });
    });

    it('returns zero unread count when all messages are read', async () => {
      const mockConversation = {
        lastMessage: { index: 3 },
        lastReadMessageIndex: 3,
        updateLastReadMessageIndex: jest.fn(),
      };

      const result = await countUnreadMessages(mockConversation);

      expect(result).toEqual({
        lastMessageIndex: 3,
        lastReadMessageIndex: 3,
        unreadMessagesCount: 0,
      });
    });

    it('handles conversation with no messages', async () => {
      const mockConversation = {
        lastReadMessageIndex: 0,
        updateLastReadMessageIndex: jest.fn(),
      };

      const result = await countUnreadMessages(mockConversation);

      expect(result).toEqual({
        lastMessageIndex: 0,
        lastReadMessageIndex: 0,
        unreadMessagesCount: 0,
      });
    });

    it('handles conversation undefined lastMessageIndex', async () => {
      const mockConversation = {
        lastMessageIndex: undefined,
        lastReadMessageIndex: 0,
        updateLastReadMessageIndex: jest.fn(),
      };

      const result = await countUnreadMessages(mockConversation);

      expect(result).toEqual({
        lastMessageIndex: 0,
        lastReadMessageIndex: 0,
        unreadMessagesCount: 0,
      });
    });
  });
});

describe('Chat Utils updateNotificationLevel', () => {
  const mockOnSuccess = jest.fn();
  const mockConversation = {
    setUserNotificationLevel: jest.fn().mockResolvedValue(undefined),
  };
  it('calls onSuccess when the notification level is successfully updated', async () => {
    const mockClient = {
      getConversationBySid: jest.fn().mockResolvedValue(mockConversation),
    };

    const mockSid = 'CH_123';
    const mockLevel = NOTIFICATION_LEVEL.MUTED;

    await updateNotificationLevel({
      client: mockClient,
      sid: mockSid,
      level: mockLevel,
      onSuccess: mockOnSuccess,
    });

    expect(mockClient.getConversationBySid).toHaveBeenCalledWith(mockSid);
    expect(mockConversation.setUserNotificationLevel).toHaveBeenCalledWith(
      mockLevel
    );
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('does not call onSuccess if conversation is not found', async () => {
    const mockClient = {
      getConversationBySid: jest.fn().mockResolvedValue(null),
    };

    await updateNotificationLevel({
      client: mockClient,
      sid: '123',
      level: NOTIFICATION_LEVEL.DEFAULT,
      onSuccess: mockOnSuccess,
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('does call onError if conversation is not found', async () => {
    const mockClient = {
      getConversationBySid: jest
        .fn()
        .mockResolvedValue(new Error('Conversation not found')),
    };
    const mockOnError = jest.fn();

    await updateNotificationLevel({
      client: mockClient,
      sid: '123',
      level: NOTIFICATION_LEVEL.DEFAULT,
      onSuccess: mockOnSuccess,
      onError: mockOnError,
    });

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
