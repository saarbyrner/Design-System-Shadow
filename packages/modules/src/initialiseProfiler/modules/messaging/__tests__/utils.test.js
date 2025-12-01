import getInitialData from '@kitman/services/src/services/messaging/getInitialData';
import {
  handleTokenRefresh,
  updateUnreadMessages,
  populateInitialUnreadMessages,
  getToastMessageData,
  handleNotifications,
  isNotificationEnabled,
} from '@kitman/modules/src/initialiseProfiler/modules/messaging/utils';
import {
  countUnreadMessages,
  getMessageTimeString,
} from '@kitman/modules/src/Messaging/src/utils';
import { getAndConvertAllConversations } from '@kitman/modules/src/Messaging/src/paginationHelper';
import { TOAST_TYPE } from '@kitman/components/src/Toast/types';
import { NOTIFICATION_LEVEL } from '@kitman/modules/src/Messaging/src/types';

jest.mock('@kitman/services/src/services/messaging/getInitialData');
jest.mock('@kitman/modules/src/Messaging/src/utils', () => ({
  countUnreadMessages: jest.fn(),
  getMessageTimeString: jest.fn(),
}));
jest.mock('@kitman/modules/src/Messaging/src/paginationHelper', () => ({
  getAndConvertAllConversations: jest.fn(),
}));

const mockResponse = {
  context: JSON.stringify({ token: 'new-token-123' }),
};

const mockBaseMessage = {
  conversation: {
    friendlyName: 'General Channel',
    attributes: {},
    sid: 'CH1234',
  },
  attachedMedia: [],
  body: '',
  author: 'Richard Coleman',
};

describe('handleTokenRefresh', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      updateToken: jest.fn(),
    };
  });

  it('successfully updates client token', async () => {
    getInitialData.mockResolvedValue(mockResponse);

    await handleTokenRefresh(mockClient);

    expect(getInitialData).toHaveBeenCalledTimes(1);
    expect(mockClient.updateToken).toHaveBeenCalledWith('new-token-123');
  });
});

describe('updateUnreadMessages', () => {
  const mockCallback = jest.fn();
  const mockConversation = {
    sid: '123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call callback with correct parameters when countUnreadMessages succeeds', async () => {
    const mockUnreadMessagesCount = 5;
    countUnreadMessages.mockResolvedValue({
      unreadMessagesCount: mockUnreadMessagesCount,
    });

    await updateUnreadMessages(mockConversation, mockCallback);

    expect(countUnreadMessages).toHaveBeenCalledWith(mockConversation);
    expect(mockCallback).toHaveBeenCalledWith({
      sid: '123',
      count: mockUnreadMessagesCount,
    });
  });
});

describe('populateInitialUnreadMessages', () => {
  let mockClient;
  let mockCallback;
  let mockConversationPaginator;

  beforeEach(() => {
    mockCallback = jest.fn();
    mockConversationPaginator = {};
    mockClient = {
      getSubscribedConversations: jest
        .fn()
        .mockResolvedValue(mockConversationPaginator),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call callback for each conversation with correct data', async () => {
    const mockConversations = [
      { sid: 'conv1', unreadMessagesCount: 5 },
      { sid: 'conv2', unreadMessagesCount: 0 },
      { sid: 'conv3', unreadMessagesCount: 12 },
    ];

    getAndConvertAllConversations.mockResolvedValue(mockConversations);

    await populateInitialUnreadMessages(mockClient, mockCallback);

    expect(mockClient.getSubscribedConversations).toHaveBeenCalledTimes(1);
    expect(getAndConvertAllConversations).toHaveBeenCalledWith(
      mockConversationPaginator,
      mockClient
    );
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, { sid: 'conv1', count: 5 });
    expect(mockCallback).toHaveBeenNthCalledWith(2, { sid: 'conv2', count: 0 });
    expect(mockCallback).toHaveBeenNthCalledWith(3, {
      sid: 'conv3',
      count: 12,
    });
  });

  it('should handle empty conversations array', async () => {
    getAndConvertAllConversations.mockResolvedValue([]);

    await populateInitialUnreadMessages(mockClient, mockCallback);

    expect(mockClient.getSubscribedConversations).toHaveBeenCalledTimes(1);
    expect(getAndConvertAllConversations).toHaveBeenCalledWith(
      mockConversationPaginator,
      mockClient
    );
    expect(mockCallback).not.toHaveBeenCalled();
  });
});

describe('getToastMessageData', () => {
  beforeEach(() => {
    getMessageTimeString.mockReturnValue('10:00 AM');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected message data', async () => {
    const mockMessage = {
      ...mockBaseMessage,
      body: 'Test message body',
    };

    const result = await getToastMessageData(mockMessage);

    expect(result).toStrictEqual({
      title: 'Richard Coleman · General Channel',
      description: mockMessage.body,
      metadata: {
        time: '10:00 AM',
        channelSid: mockBaseMessage.conversation.sid,
      },
      type: TOAST_TYPE.MESSAGE,
    });
  });

  it('returns message with media description when no body', async () => {
    const mockMessage = {
      ...mockBaseMessage,
      attachedMedia: [{ image: 'test.png' }],
    };

    const result = await getToastMessageData(mockMessage);

    expect(result).toStrictEqual({
      title: 'Richard Coleman · General Channel',
      description: 'Received media attachment...',
      metadata: {
        time: '10:00 AM',
        channelSid: mockBaseMessage.conversation.sid,
      },
      type: TOAST_TYPE.MESSAGE,
    });
  });

  it('omits channel in title when direct message', async () => {
    const mockMessage = {
      ...mockBaseMessage,
      conversation: {
        attributes: { channelType: 'direct' },
      },
      body: 'Direct message body',
    };

    const result = await getToastMessageData(mockMessage);

    expect(result.title).toBe('Richard Coleman');
    expect(result.description).toBe(mockMessage.body);
  });
});

describe('handleNotifications', () => {
  const mockCallback = jest.fn();

  it('should call callback with correct parameters', async () => {
    await handleNotifications(mockBaseMessage, mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      title: 'Richard Coleman · General Channel',
      description: mockBaseMessage.body,
      metadata: {
        time: '10:00 AM',
        channelSid: mockBaseMessage.conversation.sid,
      },
      type: TOAST_TYPE.MESSAGE,
    });
  });
});

describe('isNotificationEnabled', () => {
  const currentUser = 'Richard Coleman';
  const otherUser = 'John Doe';
  const mockMessage = {
    ...mockBaseMessage,
    author: otherUser,
    conversation: {
      ...mockBaseMessage.conversation,
      notificationLevel: NOTIFICATION_LEVEL.DEFAULT,
    },
  };

  it('should return true when all conditions are met', () => {
    const route = '/dashboard';

    const result = isNotificationEnabled(mockMessage, currentUser, route);

    expect(result).toBe(true);
  });

  it('should return false when the author is the current user', () => {
    const route = '/dashboard';
    const messageFromCurrentUser = {
      ...mockMessage,
      author: currentUser,
    };

    const result = isNotificationEnabled(
      messageFromCurrentUser,
      currentUser,
      route
    );

    expect(result).toBe(false);
  });

  it('should return false when the route starts with /messaging', () => {
    const route = '/messaging/123';

    const result = isNotificationEnabled(mockMessage, currentUser, route);

    expect(result).toBe(false);
  });

  it('should return false when the conversation is muted', () => {
    const route = '/dashboard';
    const mutedMessage = {
      ...mockMessage,
      conversation: {
        ...mockMessage.conversation,
        notificationLevel: NOTIFICATION_LEVEL.MUTED,
      },
    };

    const result = isNotificationEnabled(mutedMessage, currentUser, route);

    expect(result).toBe(false);
  });

  it('should return false when conversation is null/undefined', () => {
    const route = '/dashboard';
    const messageWithoutConversation = {
      ...mockMessage,
      conversation: null,
    };

    const result = isNotificationEnabled(
      messageWithoutConversation,
      currentUser,
      route
    );

    expect(result).toBe(false);
  });
});
