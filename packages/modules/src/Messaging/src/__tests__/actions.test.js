import moment from 'moment';
import $ from 'jquery';

import {
  handleUsernameReceived,
  handleNewMessage,
  handleMessageSent,
  handleChannelListUpdated,
  handleChangedChannel,
  handleJoinedAChannel,
  handleLeftAChannel,
  handleNewMessageBatch,
  handleFetchMessagesStatus,
  handleChannelUpdated,
  handleMessagesRead,
  handleUserDetailsReceived,
  handleCurrentChannelMemberUpdated,
  handleGeneralStatusChanged,
  handleChannelCreated,
  handleMessageRejected,
  handleRefreshMediaMessage,
  handleUpdateMediaExpires,
  handleSendingMedia,
  handleMediaSent,
  handleMediaRejected,
  checkChannelExistsStart,
  checkChannelExistsSuccess,
  checkChannelExistsFailure,
  updateCurrentChannelMembers,
  addOrRemoveChannelMembers,
  openChannelImageUploadModal,
  closeChannelImageUploadModal,
  handleMemberLeft,
  handleMemberJoined,
  uploadConversationIcon,
  updateChannelDetails,
  createConversation,
  requestNextPageOfMessages,
  requestPreviousPageOfMessages,
} from '../actions';

const channelNameErrorResponse = {
  success: false,
  errors: {
    unique_name: ['Channel name must be unique'],
  },
};

const generalErrorResponse = {
  success: false,
  errors: {
    someOtherIssue: ['Something went wrong'],
  },
};

jest.mock('jquery', () => {
  const mock$ = jest.fn().mockReturnValue({
    attr: jest.fn().mockReturnValue('fake-csrf-token'),
  });

  const deferred = () => {
    let doneCallback;
    let failCallback;
    return {
      done: jest.fn(function done(cb) {
        doneCallback = cb;
        return this;
      }),
      fail: jest.fn(function fail(cb) {
        failCallback = cb;
        return this;
      }),
      resolve: jest.fn(function resolve(...args) {
        if (doneCallback) {
          doneCallback(...args);
        }
      }),
      reject: jest.fn(function reject(...args) {
        if (failCallback) {
          failCallback(...args);
        }
      }),
    };
  };

  mock$.ajax = jest.fn(() => deferred());
  mock$.Deferred = deferred;

  return mock$;
});

describe('Athlete Chat Actions', () => {
  it('has the correct action HANDLE_USERNAME_RECEIVED', () => {
    const expectedAction = {
      type: 'HANDLE_USERNAME_RECEIVED',
      payload: {
        username: 'David',
      },
    };

    expect(handleUsernameReceived('David')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_NEW_MESSAGE', () => {
    const expectedAction = {
      type: 'HANDLE_NEW_MESSAGE',
      payload: {
        channelId: '12345',
        message: {
          messageType: 'ME',
          body: 'New message',
          index: 5,
          sid: '54321',
          authorDetails: {
            authorName: 'You',
          },
          time: undefined,
          date: undefined,
          media: undefined,
          mediaDetails: undefined,
        },
      },
    };

    expect(handleNewMessage('New message', 'ME', 5, '54321', '12345')).toEqual(
      expectedAction
    );
  });

  it('has the correct action data for HANDLE_NEW_MESSAGE with full set of payload values', () => {
    const dateMoment = moment();

    const mediaDetails = {
      url: 'http://somethingurl.jpg?Expires=1925657799000',
      contentClass: 'image',
      isWebDisplayable: true,
      friendlyMediaSize: '10KB',
      expiration: dateMoment,
      hasExpired: false,
    };

    const expectedAction = {
      type: 'HANDLE_NEW_MESSAGE',
      payload: {
        channelId: '12345',
        message: {
          messageType: 'ME',
          body: 'New message',
          index: 5,
          sid: '54321',
          authorDetails: {
            authorName: 'Charles Dickens',
          },
          time: '14:00',
          date: dateMoment,
          media: undefined,
          mediaDetails,
        },
      },
    };

    expect(
      handleNewMessage(
        'New message',
        'ME',
        5,
        '54321',
        '12345',
        {
          authorName: 'Charles Dickens',
        },
        '14:00',
        dateMoment,
        undefined,
        mediaDetails
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_MESSAGE_SENT', () => {
    const expectedAction = {
      type: 'HANDLE_MESSAGE_SENT',
      payload: {
        messageIndex: 10,
      },
    };

    expect(handleMessageSent(10)).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CHANNEL_LIST_UPDATED', () => {
    const expectedAction = {
      type: 'HANDLE_CHANNEL_LIST_UPDATED',
      payload: {
        channels: [
          {
            sid: '1234',
            friendlyName: 'General Channel',
            status: 'joined',
          },
        ],
        channelType: 'PRIVATE',
      },
    };

    expect(
      handleChannelListUpdated(
        [
          {
            sid: '1234',
            friendlyName: 'General Channel',
            status: 'joined',
          },
        ],
        'PRIVATE'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CHANNEL_LIST_UPDATED for DIRECT channels', () => {
    const expectedAction = {
      type: 'HANDLE_CHANNEL_LIST_UPDATED',
      payload: {
        channels: [
          {
            sid: '1234',
            friendlyName: 'Direct Channel',
            status: 'joined',
          },
        ],
        channelType: 'DIRECT',
      },
    };

    expect(
      handleChannelListUpdated(
        [
          {
            sid: '1234',
            friendlyName: 'Direct Channel',
            status: 'joined',
          },
        ],
        'DIRECT'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CHANGED_CHANNEL', () => {
    const expectedAction = {
      type: 'HANDLE_CHANGED_CHANNEL',
      payload: {
        channel: {
          sid: '1234',
          friendlyName: 'General Channel',
          isPublic: false,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'GE',
          unreadMessagesCount: 2,
          creationType: 'private',
          description: 'Some channel description',
        },
        memberAttributes: { role: 'channel user' },
      },
    };

    expect(
      handleChangedChannel(
        {
          sid: '1234',
          friendlyName: 'General Channel',
          isPublic: false,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'GE',
          unreadMessagesCount: 2,
          creationType: 'private',
          description: 'Some channel description',
        },
        { role: 'channel user' }
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CHANGED_CHANNEL for direct channel', () => {
    const expectedAction = {
      type: 'HANDLE_CHANGED_CHANNEL',
      payload: {
        channel: {
          sid: '1234',
          friendlyName: 'Direct Message Channel',
          isPublic: false,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'DM',
          unreadMessagesCount: 2,
          creationType: 'direct',
          description: 'optional description',
          directMessageParticipants: {
            target: {
              identity: 'id 1',
              friendlyName: 'Friend 1',
            },
            creator: {
              identity: 'id 2',
              friendlyName: 'Friend 2',
            },
          },
        },
        memberAttributes: { role: 'channel user' },
      },
    };

    expect(
      handleChangedChannel(
        {
          sid: '1234',
          friendlyName: 'Direct Message Channel',
          isPublic: false,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'DM',
          unreadMessagesCount: 2,
          description: 'optional description',
          creationType: 'direct',
          directMessageParticipants: {
            target: {
              identity: 'id 1',
              friendlyName: 'Friend 1',
            },
            creator: {
              identity: 'id 2',
              friendlyName: 'Friend 2',
            },
          },
        },
        { role: 'channel user' }
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_JOINED_A_CHANNEL', () => {
    const expectedAction = {
      type: 'HANDLE_JOINED_A_CHANNEL',
      payload: {
        channel: {
          sid: '4567',
          friendlyName: 'General Channel',
          isPublic: true,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'GE',
          unreadMessagesCount: 0,
          description: 'Some channel description',
          creationType: 'private',
        },
      },
    };

    expect(
      handleJoinedAChannel({
        sid: '4567',
        friendlyName: 'General Channel',
        isPublic: true,
        status: 'joined',
        lastConsumedMessageIndex: 3,
        lastMessageIndex: 5,
        shortName: 'GE',
        unreadMessagesCount: 0,
        description: 'Some channel description',
        creationType: 'private',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_LEFT_A_CHANNEL', () => {
    const expectedAction = {
      type: 'HANDLE_LEFT_A_CHANNEL',
      payload: {
        sid: '1234',
      },
    };

    expect(handleLeftAChannel('1234')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_NEW_MESSAGE_BATCH', () => {
    const expectedAction = {
      type: 'HANDLE_NEW_MESSAGE_BATCH',
      payload: {
        channelId: '12345',
        messages: [
          {
            messageType: 'THEM',
            body: 'New message',
            index: 5,
            author: 'Charles Dickens',
            time: '14:00',
          },
        ],
        listAction: 'APPEND',
        hasAnotherPage: true,
        hasPageOtherDirection: true,
      },
    };
    const chatMessages = [
      {
        messageType: 'THEM',
        body: 'New message',
        index: 5,
        author: 'Charles Dickens',
        time: '14:00',
      },
    ];

    expect(
      handleNewMessageBatch('12345', chatMessages, 'APPEND', true, true)
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_FETCH_MESSAGES_STATUS', () => {
    const fetchingAction = {
      type: 'HANDLE_FETCH_MESSAGES_STATUS',
      payload: {
        requestStatus: 'FETCHING',
      },
    };

    expect(handleFetchMessagesStatus('FETCHING')).toEqual(fetchingAction);

    const fetchCompleteAction = {
      type: 'HANDLE_FETCH_MESSAGES_STATUS',
      payload: {
        requestStatus: 'FETCH_COMPLETE',
      },
    };

    expect(handleFetchMessagesStatus('FETCH_COMPLETE')).toEqual(
      fetchCompleteAction
    );
  });

  it('has the correct action HANDLE_CHANNEL_UPDATED', () => {
    const expectedAction = {
      type: 'HANDLE_CHANNEL_UPDATED',
      payload: {
        channel: {
          sid: '4567',
          friendlyName: 'General Channel',
          isPublic: true,
          status: 'joined',
          lastConsumedMessageIndex: 3,
          lastMessageIndex: 5,
          shortName: 'GE',
          unreadMessagesCount: 0,
          description: 'Some channel description',
          creationType: 'private',
        },
      },
    };

    expect(
      handleChannelUpdated({
        sid: '4567',
        friendlyName: 'General Channel',
        isPublic: true,
        status: 'joined',
        lastConsumedMessageIndex: 3,
        lastMessageIndex: 5,
        shortName: 'GE',
        unreadMessagesCount: 0,
        description: 'Some channel description',
        creationType: 'private',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_MESSAGES_READ', () => {
    const expectedAction = {
      type: 'HANDLE_MESSAGES_READ',
      payload: {
        channelId: '1234',
        remainingUnreadCount: 5,
      },
    };

    expect(handleMessagesRead('1234', 5)).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_USER_DETAILS_RECEIVED', () => {
    const expectedAction = {
      type: 'HANDLE_USER_DETAILS_RECEIVED',
      payload: {
        username: 'some id',
        friendlyName: 'Mr. Friendly Name',
        userAttributes: {},
      },
    };

    expect(
      handleUserDetailsReceived('some id', 'Mr. Friendly Name', {})
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED', () => {
    const expectedAction = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED',
      payload: {
        memberIdentity: 'some identity',
        memberAttributes: { role: 'channel user' },
        lastReadMessageIndex: 1,
        lastReadTimestamp: '2011-10-05T14:48:00.000Z',
      },
    };

    expect(
      handleCurrentChannelMemberUpdated(
        'some identity',
        {
          role: 'channel user',
        },
        1,
        '2011-10-05T14:48:00.000Z'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_GENERAL_STATUS_CHANGED', () => {
    const expectedAction = {
      type: 'HANDLE_GENERAL_STATUS_CHANGED',
      payload: {
        status: 'CONNECTED',
      },
    };

    expect(handleGeneralStatusChanged('CONNECTED')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CHANNEL_CREATED', () => {
    const expectedAction = {
      type: 'HANDLE_CHANNEL_CREATED',
      payload: {
        channelId: '12345',
      },
    };

    expect(handleChannelCreated('12345')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_MESSAGE_REJECTED', () => {
    const errorReason = new Error('Whoops! message error');
    const expectedAction = {
      type: 'HANDLE_MESSAGE_REJECTED',
      payload: {
        messageBody: 'some message text',
        reason: errorReason,
      },
    };

    expect(handleMessageRejected('some message text', errorReason)).toEqual(
      expectedAction
    );
  });

  it('has the correct action HANDLE_MEDIA_REJECTED', () => {
    const errorReason = new Error('Whoops media error');
    const expectedAction = {
      type: 'HANDLE_MEDIA_REJECTED',
      payload: {
        filename: 'some_file.txt',
        reason: errorReason,
      },
    };

    expect(handleMediaRejected('some_file.txt', errorReason)).toEqual(
      expectedAction
    );
  });

  it('has the correct action HANDLE_REFRESH_MEDIA_MESSAGE', () => {
    const expectedAction = {
      type: 'HANDLE_REFRESH_MEDIA_MESSAGE',
      payload: {
        channelId: '123',
        messageSid: '456',
        url: 'http://www.updatedUrl.com',
      },
    };

    expect(
      handleRefreshMediaMessage('123', '456', 'http://www.updatedUrl.com')
    ).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_UPDATE_MEDIA_EXPIRES', () => {
    const expectedAction = {
      type: 'HANDLE_UPDATE_MEDIA_EXPIRES',
    };

    expect(handleUpdateMediaExpires()).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_SENDING_MEDIA', () => {
    const expectedAction = {
      type: 'HANDLE_SENDING_MEDIA',
      payload: {
        filename: 'filename.jpg',
      },
    };

    expect(handleSendingMedia('filename.jpg')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_MEDIA_SENT', () => {
    const expectedAction = {
      type: 'HANDLE_MEDIA_SENT',
      payload: {
        filename: 'filename.jpg',
      },
    };

    expect(handleMediaSent('filename.jpg')).toEqual(expectedAction);
  });

  it('has the correct action CHECK_CHANNEL_EXISTS_START', () => {
    const expectedAction = {
      type: 'CHECK_CHANNEL_EXISTS_START',
    };

    expect(checkChannelExistsStart()).toEqual(expectedAction);
  });

  it('has the correct action CHECK_CHANNEL_EXISTS_SUCCESS', () => {
    const expectedAction = {
      type: 'CHECK_CHANNEL_EXISTS_SUCCESS',
    };

    expect(checkChannelExistsSuccess()).toEqual(expectedAction);
  });

  it('has the correct action CHECK_CHANNEL_EXISTS_FAILURE', () => {
    const expectedAction = {
      type: 'CHECK_CHANNEL_EXISTS_FAILURE',
    };

    expect(checkChannelExistsFailure()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_CURRENT_CHANNEL_MEMBERS', () => {
    const members = [
      {
        messagingIdentity: '06||001',
        friendlyName: 'FriendlyName 001',
        memberKind: 'STAFF',
      },
      {
        messagingIdentity: '06||002',
        friendlyName: 'FriendlyName 002',
        memberKind: 'ATHLETE',
      },
    ];

    const expectedAction = {
      type: 'UPDATE_CURRENT_CHANNEL_MEMBERS',
      payload: {
        members,
      },
    };

    expect(updateCurrentChannelMembers(members)).toEqual(expectedAction);
  });

  it('has the correct action OPEN_CHANNEL_IMAGE_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_CHANNEL_IMAGE_UPLOAD_MODAL',
    };

    expect(openChannelImageUploadModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL',
    };

    expect(closeChannelImageUploadModal()).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CURRENT_CHANNEL_MEMBER_LEFT', () => {
    const expectedAction = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_LEFT',
      payload: {
        memberIdentity: 'memberId',
      },
    };

    expect(handleMemberLeft('memberId')).toEqual(expectedAction);
  });

  it('has the correct action HANDLE_CURRENT_CHANNEL_MEMBER_JOINED', () => {
    const messagingMember = {
      messagingIdentity: 'someIdentity',
      userId: 'someId',
      memberKind: 'ATHLETE',
    };

    const expectedAction = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_JOINED',
      payload: {
        member: messagingMember,
      },
    };

    expect(handleMemberJoined(messagingMember)).toEqual(expectedAction);
  });

  describe('when requesting pages of messages', () => {
    const state = {
      athleteChat: {
        sid: '123',
        username: 'Tester',
        messages: [
          {
            messageType: 'THEM',
            body: 'First message',
            index: 10,
            author: 'Charles Dickens',
            time: '14:00',
          },
          {
            messageType: 'ME',
            body: 'Second message',
            index: 11,
            author: 'Tester',
            time: '14:00',
          },
          {
            messageType: 'ME',
            body: 'Third message',
            index: 12,
            author: 'Tester',
            time: '14:00',
          },
          {
            messageType: 'LOG',
            body: 'New log message',
            index: 13,
          },
          {
            messageType: 'LOG',
            body: 'New log message',
            index: 14,
          },
        ],
      },
    };

    it('ignores LOG messages in requestNextPageOfMessages when calculating next page from index', async () => {
      const getState = jest.fn().mockReturnValue(state);
      const getMessages = jest.fn().mockResolvedValue(null);
      const fakeActiveChannel = {
        lastMessage: { index: 16 }, // Meaning more messages are on the server
        getMessages,
      };

      const thunk = requestNextPageOfMessages(fakeActiveChannel);
      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCHING' },
      });
      // Get 50 messages from index 3 (inclusive)
      expect(getMessages).toHaveBeenCalledWith(50, 13, 'forward');

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'HANDLE_NEW_MESSAGE_BATCH',
        payload: {
          channelId: undefined,
          messages: [],
          listAction: 'APPEND',
          hasAnotherPage: false,
          hasPageOtherDirection: false,
        },
      });

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCH_COMPLETE' },
      });
    });

    it('will not call getMessages from requestNextPageOfMessages if last message index already received', async () => {
      const getState = jest.fn().mockReturnValue(state);
      const getMessages = jest.fn().mockResolvedValue(null);
      const fakeActiveChannel = {
        lastMessage: { index: 12 }, // Meaning we already have the latest real message
        getMessages,
      };

      const thunk = requestNextPageOfMessages(fakeActiveChannel);
      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCHING' },
      });

      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCH_COMPLETE' },
      });

      expect(getMessages).not.toHaveBeenCalled();
    });

    it('ignores LOG messages in requestPreviousPageOfMessages when calculating next page from index', async () => {
      const getState = jest.fn().mockReturnValue(state);
      const getMessages = jest.fn().mockResolvedValue(null);
      const fakeActiveChannel = {
        getMessages,
      };

      const thunk = requestPreviousPageOfMessages(fakeActiveChannel);
      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCHING' },
      });
      // As first message loaded has index 10:
      // Get 50 messages prior to index 9 (inclusive).
      expect(getMessages).toHaveBeenCalledWith(50, 9, 'backwards');

      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'HANDLE_NEW_MESSAGE_BATCH',
        payload: {
          channelId: undefined,
          messages: [],
          listAction: 'PREPEND',
          hasAnotherPage: false,
          hasPageOtherDirection: false,
        },
      });

      expect(dispatcher.mock.calls[2][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCH_COMPLETE' },
      });
    });

    it('will not call getMessages from requestPreviousPageOfMessages if index zero message already received', async () => {
      const getState = jest.fn();
      const firstMessageState = {
        athleteChat: {
          sid: '123',
          username: 'Tester',
          messages: [
            {
              messageType: 'THEM',
              body: 'First message',
              index: 0,
              author: 'Charles Dickens',
              time: '14:00',
            },
          ],
        },
      };

      getState.mockReturnValue(firstMessageState);

      const getMessages = jest.fn().mockResolvedValue(null);
      const fakeActiveChannel = {
        getMessages,
      };

      const thunk = requestPreviousPageOfMessages(fakeActiveChannel);
      const dispatcher = jest.fn();
      await thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCHING' },
      });

      expect(dispatcher.mock.calls[1][0]).toEqual({
        type: 'HANDLE_FETCH_MESSAGES_STATUS',
        payload: { requestStatus: 'FETCH_COMPLETE' },
      });

      expect(getMessages).not.toHaveBeenCalled();
    });
  });

  describe('when uploading a channel icon', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      $.ajax.mockClear();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('when the server request is successful', () => {
      it('dispatches the correct actions', () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const state = { athleteChat: { currentChannel: { sid: 'somesid' } } };
        const getState = jest.fn().mockReturnValue(state);
        const response = { uri: 'some public image url' };
        const file = Buffer.from('fake image data');
        file.name = 'fakeImage.jpg';

        const thunk = uploadConversationIcon(file);
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        deferred.resolve(response);

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
          payload: { filename: 'fakeImage.jpg' },
        });
        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_SETTINGS_UPDATED_ICON',
          payload: { channelIconUrl: 'some public image url' },
        });

        jest.advanceTimersByTime(2000);

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS',
          payload: { filename: 'fakeImage.jpg' },
        });
      });
    });

    describe('when the server request fails', () => {
      it('dispatches the correct actions', async () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const state = { athleteChat: { currentChannel: { sid: 'somesid' } } };
        const getState = jest.fn().mockReturnValue(state);
        const file = Buffer.from('fake image data');
        file.name = 'some fake file';

        const thunk = uploadConversationIcon(file);
        const dispatcher = jest.fn();
        const promise = thunk(dispatcher, getState);

        deferred.reject({ status: 500 });

        try {
          await promise;
        } catch (e) {
          // Expected promise rejection
        }

        jest.advanceTimersByTime(2000);

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
          payload: { filename: 'some fake file' },
        });
        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE',
          payload: { filename: 'some fake file' },
        });
      });
    });
  });

  describe('when updating channel details', () => {
    it('handles a unique name error in successful 200 response', async () => {
      const deferred = $.Deferred();
      $.ajax.mockImplementation(() => deferred);

      const state = { athleteChat: { currentChannel: { sid: 'somesid' } } };
      const getState = jest.fn().mockReturnValue(state);

      const thunk = updateChannelDetails(
        'somesid',
        'channelName',
        'channelDescription',
        'channelAvatarUrl'
      );
      const dispatcher = jest.fn();
      const promise = thunk(dispatcher, getState);

      deferred.reject({
        status: 422,
        responseText: JSON.stringify(channelNameErrorResponse),
      });

      await expect(promise).rejects.toThrow(
        `Failed to update channel: ${JSON.stringify(channelNameErrorResponse)}`
      );

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS',
      });
      expect(dispatcher).toHaveBeenCalledWith({
        type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
        payload: { reason: 'OTHER_ERROR' },
      });
    });
  });

  describe('when creating a conversation', () => {
    beforeEach(() => {
      $.ajax.mockClear();
    });

    describe('when the server request is successful', () => {
      it('dispatches the correct actions and resolves with the new SID', async () => {
        const successResponse = { sid: 'new-sid-123', success: true };
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const getState = jest.fn();
        const dispatcher = jest.fn();
        const client = {}; // Mock client

        const thunk = createConversation(
          client,
          'private',
          'My New Channel',
          'A great description',
          { athletes: [], staff: [] },
          true,
          true
        );

        const promise = thunk(dispatcher, getState);

        deferred.resolve(successResponse);

        await expect(promise).resolves.toBe('new-sid-123');

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'HANDLE_CHANNEL_CREATED',
          payload: { channelId: 'new-sid-123' },
        });
      });
    });

    describe('when the server request fails due to an already in use name', () => {
      it('rejects with an error FAILURE_NAME_IN_USE', async () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const getState = jest.fn();
        const dispatcher = jest.fn();
        const client = {};

        const thunk = createConversation(
          client,
          'private',
          'Existing Channel',
          'description',
          { athletes: [], staff: [] },
          true,
          true
        );
        const promise = thunk(dispatcher, getState);

        deferred.reject({
          status: 422,
          responseText: JSON.stringify(channelNameErrorResponse),
        });

        await expect(promise).rejects.toThrow('FAILURE_NAME_IN_USE');
        expect(dispatcher).not.toHaveBeenCalled();
      });
    });

    describe('when the server request fails for an unknown reason', () => {
      it('rejects with an error FAILURE_GENERAL_ERROR', async () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const getState = jest.fn();
        const dispatcher = jest.fn();
        const client = {};

        const thunk = createConversation(
          client,
          'private',
          'Another Channel',
          'description',
          { athletes: [], staff: [] },
          true,
          true
        );
        const promise = thunk(dispatcher, getState);

        deferred.reject({
          status: 500,
          responseText: JSON.stringify(generalErrorResponse),
        });

        await expect(promise).rejects.toThrow('FAILURE_GENERAL_ERROR');
        expect(dispatcher).not.toHaveBeenCalled();
      });
    });
  });

  describe('when adding or removing participants in a conversation', () => {
    beforeEach(() => {
      $.ajax.mockClear();
    });

    describe('when the server request is successful', () => {
      it('dispatches the correct actions', async () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const successResponse = { sid: '123' };
        const state = { athleteChat: { currentChannel: { sid: 'somesid' } } };
        const getState = jest.fn().mockReturnValue(state);
        const thunk = addOrRemoveChannelMembers(
          [],
          { athletes: [], staff: [] },
          true,
          true
        );
        const dispatcher = jest.fn();
        const promise = thunk(dispatcher, getState);

        deferred.resolve(successResponse);
        await promise;

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS',
        });

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_MEMBERS_UPDATE_COMPLETE',
        });
      });
    });

    describe('when the server request fails', () => {
      it('rejects with an error and dispatches failure action', async () => {
        const deferred = $.Deferred();
        $.ajax.mockImplementation(() => deferred);

        const state = { athleteChat: { currentChannel: { sid: 'somesid' } } };
        const getState = jest.fn().mockReturnValue(state);
        const thunk = addOrRemoveChannelMembers(
          [],
          { athletes: [], staff: [] },
          true,
          true
        );
        const dispatcher = jest.fn();
        const promise = thunk(dispatcher, getState);

        deferred.reject({
          status: 422,
          responseText: JSON.stringify(generalErrorResponse),
        });

        await expect(promise).rejects.toThrow(
          'Failed to update channel members'
        );

        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS',
        });
        expect(dispatcher).toHaveBeenCalledWith({
          type: 'CHANNEL_MEMBERS_UPDATE_FAILED',
        });
      });
    });
  });
});
