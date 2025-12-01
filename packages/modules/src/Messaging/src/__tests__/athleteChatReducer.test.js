import moment from 'moment-timezone';
import { getExpirationFromUrl } from '@kitman/common/src/utils/mediaHelper';
import athleteChat from '../redux/reducers/athleteChat';
import dummyChatMessages from '../../resources/dummyChatMessages';

describe('Athlete Chat reducer', () => {
  const defaultState = {
    username: 'some name',
    userFriendlyName: 'some friendly name',
    userRole: {
      permissions: {
        canViewMessaging: true,
        canCreatePrivateChannel: true,
        canCreateDirectChannel: true,
        canAdministrateChannel: true,
      },
      identity: 'org||SOMEid',
      orgId: 'org',
      staffUserId: 'SOMEid',
    },
    messages: [...dummyChatMessages],
    selectedMessageIndex: null,
    selectedMessageMediaChangedTime: null,
    userChannels: [],
    directChannels: [],
    currentChannel: null,
    currentChannelExtraData: {
      hasUnretrievedNewerMessages: false,
      hasUnretrievedOlderMessages: false,
      fetchMessagesStatus: 'NOT_REQUESTED_YET',
      memberRole: undefined,
    },
    channelMembersModal: {
      isOpen: false,
    },
    generalStatus: 'CONNECTING',
    inProgressMedia: [],
    searchableItemGroups: {
      staff: [],
      athletes: [],
      userChannels: [],
      directChannels: [],
    },
    imageUploadModal: {
      isOpen: false,
    },
  };

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns correct state on HANDLE_NEW_MESSAGE', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        isPublic: true,
        status: 'unknown',
        lastConsumedMessageIndex: 0,
        lastMessageIndex: 0,
        shortName: 'NE',
        unreadMessagesCount: 0,
      },
    };

    const action = {
      type: 'HANDLE_NEW_MESSAGE',
      payload: {
        channelId: 'CURRENT_CHANNEL_ID',
        message: {
          messageType: 'ME',
          body: 'Handle New message please',
          index: 4,
          author: 'You',
          time: '19:00',
        },
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [
        { body: 'Connecting...', index: 0 },
        { author: 'You', body: 'Hello!', index: 1 },
        { author: 'Them', body: 'Hey there!', index: 2 },
        {
          author: 'You',
          body: 'New message',
          index: 3,
          time: '18:00',
        },
        {
          author: 'You',
          body: 'Handle New message please',
          index: 4,
          messageType: 'ME',
          time: '19:00',
        },
      ],
    });
  });

  it('returns correct state on HANDLE_NEW_MESSAGE with log message', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        isPublic: true,
        status: 'unknown',
        lastConsumedMessageIndex: 0,
        lastMessageIndex: 0,
        shortName: 'NE',
        unreadMessagesCount: 0,
      },
    };

    const action = {
      type: 'HANDLE_NEW_MESSAGE',
      payload: {
        message: {
          messageType: 'LOG',
          body: 'New Log Message',
        },
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [
        { body: 'Connecting...', index: 0 },
        { author: 'You', body: 'Hello!', index: 1 },
        { author: 'Them', body: 'Hey there!', index: 2 },
        {
          author: 'You',
          body: 'New message',
          index: 3,
          time: '18:00',
        },
        {
          body: 'New Log Message',
          index: 4,
          messageType: 'LOG',
        },
      ],
    });
  });

  it('returns correct state on HANDLE_USERNAME_RECEIVED', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_USERNAME_RECEIVED',
      payload: {
        username: 'New name',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      username: 'New name',
    });
  });

  it('returns correct state on HANDLE_CHANGED_CHANNEL', () => {
    const initialState = {
      ...defaultState,
      currentChannelExtraData: {
        hasUnretrievedNewerMessages: true,
        hasUnretrievedOlderMessages: true,
        fetchMessagesStatus: 'FETCH_COMPLETE',
        memberRole: undefined,
        members: ['something'],
      },
    };

    const action = {
      type: 'HANDLE_CHANGED_CHANNEL',
      payload: {
        channel: {
          sid: 'someId',
          friendlyName: 'newChannel',
          isPublic: true,
          status: 'unknown',
          lastConsumedMessageIndex: 0,
          lastMessageIndex: 0,
          shortName: 'NE',
          unreadMessagesCount: 0,
        },
        memberAttributes: { role: 'channel user - readonly' },
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [], // Clears the messages await refetch
      currentChannel: {
        sid: 'someId',
        friendlyName: 'newChannel',
        isPublic: true,
        status: 'unknown',
        lastConsumedMessageIndex: 0,
        lastMessageIndex: 0,
        shortName: 'NE',
        unreadMessagesCount: 0,
      },
      currentChannelExtraData: {
        // Resets currentChannelExtraData
        hasUnretrievedNewerMessages: false,
        hasUnretrievedOlderMessages: false,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user - readonly',
        members: [],
      },
    });
  });

  it('returns correct state on HANDLE_LEFT_A_CHANNEL', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'someId',
        friendlyName: 'newChannel',
        isPublic: true,
        status: 'unknown',
        lastConsumedMessageIndex: 0,
        lastMessageIndex: 0,
        shortName: 'NE',
        unreadMessagesCount: 0,
      },
      currentChannelExtraData: {
        hasUnretrievedNewerMessages: true,
        hasUnretrievedOlderMessages: true,
        fetchMessagesStatus: 'FETCH_COMPLETE',
        memberRole: 'channel user',
        members: ['something'],
      },
    };

    const action = {
      type: 'HANDLE_LEFT_A_CHANNEL',
      payload: {
        sid: 'someId',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [],
      currentChannel: null,
      currentChannelExtraData: {
        // Resets currentChannelExtraData
        hasUnretrievedNewerMessages: false,
        hasUnretrievedOlderMessages: false,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: undefined,
        members: [],
      },
    });
  });

  it('returns correct state on HANDLE_CHANNEL_LIST_UPDATED for USER channels', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_CHANNEL_LIST_UPDATED',
      payload: {
        channels: [
          {
            sid: 'someId',
            friendlyName: 'User Channel',
            isPublic: false,
            status: 'unknown',
            avatarUrl: 'someUrl',
          },
        ],
        channelType: 'USER',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      userChannels: [
        {
          sid: 'someId',
          friendlyName: 'User Channel',
          isPublic: false,
          status: 'unknown',
          avatarUrl: 'someUrl',
        },
      ],
      searchableItemGroups: {
        staff: [],
        athletes: [],
        userChannels: [
          {
            display_name: 'User Channel',
            identifier: 'someId',
            result_type: 'channel',
            split_searchable_values: ['user', 'channel'],
            avatar_url: 'someUrl',
          },
        ],
        directChannels: [],
      },
    });
  });

  it('returns correct state on HANDLE_CHANNEL_LIST_UPDATED for DIRECT channels', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_CHANNEL_LIST_UPDATED',
      payload: {
        channels: [
          {
            sid: 'someId',
            friendlyName: 'Direct Channel',
            isPublic: false,
            status: 'unknown',
            avatarUrl: 'someUrl',
          },
        ],
        channelType: 'DIRECT',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      directChannels: [
        {
          sid: 'someId',
          friendlyName: 'Direct Channel',
          isPublic: false,
          status: 'unknown',
          avatarUrl: 'someUrl',
        },
      ],
      searchableItemGroups: {
        staff: [],
        athletes: [],
        userChannels: [],
        directChannels: [
          {
            display_name: 'Direct Channel',
            identifier: 'someId',
            result_type: 'channel',
            split_searchable_values: ['direct', 'channel'],
            avatar_url: 'someUrl',
          },
        ],
      },
    });
  });

  it('returns correct state on HANDLE_NEW_MESSAGE_BATCH APPEND', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedNewerMessages: false,
        hasUnretrievedOlderMessages: false,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user',
      },
    };

    const action = {
      type: 'HANDLE_NEW_MESSAGE_BATCH',
      payload: {
        channelId: 'CURRENT_CHANNEL_ID',
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
        hasPageOtherDirection: false,
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: false,
        hasUnretrievedNewerMessages: true,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user',
      },
      messages: [
        { body: 'Connecting...', index: 0 },
        { author: 'You', body: 'Hello!', index: 1 },
        { author: 'Them', body: 'Hey there!', index: 2 },
        {
          author: 'You',
          body: 'New message',
          index: 3,
          time: '18:00',
        },
        {
          author: 'Charles Dickens',
          body: 'New message',
          index: 5,
          messageType: 'THEM',
          time: '14:00',
        },
      ],
    });
  });

  it('returns correct state on HANDLE_NEW_MESSAGE_BATCH PREPEND', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedNewerMessages: false,
        hasUnretrievedOlderMessages: false,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user',
      },
    };

    const action = {
      type: 'HANDLE_NEW_MESSAGE_BATCH',
      payload: {
        channelId: 'CURRENT_CHANNEL_ID',
        messages: [
          {
            messageType: 'THEM',
            body: 'New message',
            index: 5,
            author: 'Charles Dickens',
            time: '14:00',
          },
        ],
        listAction: 'PREPEND',
        hasAnotherPage: true,
        hasPageOtherDirection: false,
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: true,
        hasUnretrievedNewerMessages: false,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user',
      },
      messages: [
        {
          author: 'Charles Dickens',
          body: 'New message',
          index: 5,
          messageType: 'THEM',
          time: '14:00',
        },
        { body: 'Connecting...', index: 0 },
        { author: 'You', body: 'Hello!', index: 1 },
        { author: 'Them', body: 'Hey there!', index: 2 },
        {
          author: 'You',
          body: 'New message',
          index: 3,
          time: '18:00',
        },
      ],
    });
  });

  it('returns correct state on HANDLE_FETCH_MESSAGES_STATUS', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'someId',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: true,
        hasUnretrievedNewerMessages: true,
        fetchMessagesStatus: 'NOT_REQUESTED_YET',
        memberRole: 'channel user',
      },
    };

    const action = {
      type: 'HANDLE_FETCH_MESSAGES_STATUS',
      payload: {
        requestStatus: 'FETCHING',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannel: {
        sid: 'someId',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: true,
        hasUnretrievedNewerMessages: true,
        fetchMessagesStatus: 'FETCHING',
        memberRole: 'channel user',
      },
    });
  });

  it('returns correct state on HANDLE_CHANNEL_UPDATED', () => {
    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'current_channel_id',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
    };

    const action = {
      type: 'HANDLE_CHANNEL_UPDATED',
      payload: {
        channel: {
          sid: 'current_channel_id',
          friendlyName: 'Updated Friendly Name',
          status: 'invited',
        },
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannel: {
        sid: 'current_channel_id',
        friendlyName: 'Updated Friendly Name',
        status: 'invited',
      },
    });
  });

  it('returns correct state on HANDLE_USER_DETAILS_RECEIVED', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_USER_DETAILS_RECEIVED',
      payload: {
        username: 'some name',
        friendlyName: 'Mr. Friendly Name',
        attributes: {},
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      userFriendlyName: 'Mr. Friendly Name',
    });
  });

  it('returns correct state on HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED for the user', () => {
    const initialState = {
      ...defaultState,
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: true,
        hasUnretrievedNewerMessages: true,
        fetchMessagesStatus: 'FETCHING',
        memberRole: 'channel user',
        members: [
          {
            messagingIdentity: 'some name',
            channelRole: 'channel user',
          },
        ],
      },
    };

    const action = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED',
      payload: {
        memberIdentity: 'some name',
        memberAttributes: { role: 'channel user - readonly' },
        lastReadMessageIndex: 1,
        lastReadTimestamp: '2011-10-05T14:48:00.000Z',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannelExtraData: {
        hasUnretrievedOlderMessages: true,
        hasUnretrievedNewerMessages: true,
        fetchMessagesStatus: 'FETCHING',
        memberRole: 'channel user - readonly',
        members: [
          {
            messagingIdentity: 'some name',
            channelRole: 'channel user - readonly',
            lastReadMessageIndex: 1,
            lastReadTimestamp: '2011-10-05T14:48:00.000Z',
          },
        ],
      },
    });
  });

  it('returns correct state on HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED for other members', () => {
    const initialState = {
      ...defaultState,
      currentChannelExtraData: {
        ...defaultState.currentChannelExtraData,
        members: [
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
        ],
      },
    };

    const action = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED',
      payload: {
        memberIdentity: '06||002',
        memberAttributes: { role: 'channel user - readonly' },
        lastReadMessageIndex: 2,
        lastReadTimestamp: '2011-10-05T14:48:00.000Z',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannelExtraData: {
        ...defaultState.currentChannelExtraData,
        members: [
          {
            messagingIdentity: '06||001',
            friendlyName: 'FriendlyName 001',
            memberKind: 'STAFF',
          },
          {
            messagingIdentity: '06||002',
            friendlyName: 'FriendlyName 002',
            channelRole: 'channel user - readonly',
            memberKind: 'ATHLETE',
            lastReadMessageIndex: 2,
            lastReadTimestamp: '2011-10-05T14:48:00.000Z',
          },
        ],
      },
    });
  });

  it('returns correct state on HANDLE_CURRENT_CHANNEL_MEMBER_LEFT', () => {
    const initialState = {
      ...defaultState,
      currentChannelExtraData: {
        ...defaultState.currentChannelExtraData,
        members: [
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
        ],
      },
    };

    const action = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_LEFT',
      payload: {
        memberIdentity: '06||002',
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannelExtraData: {
        ...initialState.currentChannelExtraData,
        members: [
          {
            messagingIdentity: '06||001',
            friendlyName: 'FriendlyName 001',
            memberKind: 'STAFF',
          },
        ],
      },
    });
  });

  it('returns correct state on HANDLE_CURRENT_CHANNEL_MEMBER_JOINED', () => {
    const initialState = {
      ...defaultState,
      currentChannelExtraData: {
        ...defaultState.currentChannelExtraData,
        members: [
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
        ],
      },
    };

    const action = {
      type: 'HANDLE_CURRENT_CHANNEL_MEMBER_JOINED',
      payload: {
        member: {
          messagingIdentity: '06||003',
          friendlyName: 'FriendlyName 003',
          memberKind: 'ATHLETE',
        },
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentChannelExtraData: {
        ...initialState.currentChannelExtraData,
        members: [
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
          {
            messagingIdentity: '06||003',
            friendlyName: 'FriendlyName 003',
            memberKind: 'ATHLETE',
          },
        ],
      },
    });
  });

  it('returns correct state on OPEN_MESSAGING_MEMBERS_MODAL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'OPEN_MESSAGING_MEMBERS_MODAL',
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      channelMembersModal: {
        isOpen: true,
      },
    });
  });

  it('returns correct state on CLOSE_MESSAGING_MEMBERS_MODAL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'CLOSE_MESSAGING_MEMBERS_MODAL',
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      channelMembersModal: {
        isOpen: false,
      },
    });
  });

  it('returns correct state on HANDLE_GENERAL_STATUS_CHANGED', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_GENERAL_STATUS_CHANGED',
      payload: { status: 'CONNECTED' },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      generalStatus: 'CONNECTED',
    });
  });

  it('returns correct state on HANDLE_MESSAGE_REJECTED', () => {
    const initialState = {
      ...defaultState,
    };
    const errorReason = new Error('Whoops message error');
    const action = {
      type: 'HANDLE_MESSAGE_REJECTED',
      payload: { messageBody: 'tried to send this text', reason: errorReason },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
    });
  });

  it('returns correct state on HANDLE_REFRESH_MEDIA_MESSAGE', () => {
    const staleMediaMessage = {
      sid: '123',
      mediaDetails: { hasExpired: true, url: 'www.expiredurl.com' },
    };

    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'CURRENT_CHANNEL_ID',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      messages: [staleMediaMessage],
    };

    const refreshedUrl =
      'https://media.us1.twilio.com/ME1234?Expires=2557226596'; // Year 2051

    const action = {
      type: 'HANDLE_REFRESH_MEDIA_MESSAGE',
      payload: {
        channelId: 'CURRENT_CHANNEL_ID',
        messageSid: '123',
        url: refreshedUrl,
      },
    };

    const expiry = getExpirationFromUrl(
      'https://media.us1.twilio.com/ME1234?Expires=2557226596'
    );

    const expectedMessage = {
      sid: '123',
      mediaDetails: {
        hasExpired: false,
        url: 'https://media.us1.twilio.com/ME1234?Expires=2557226596',
        expiration: expiry,
      },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [expectedMessage],
    });
  });

  it('returns correct state on HANDLE_UPDATE_MEDIA_EXPIRES', () => {
    // It should detect the message has actually expired and update the boolean
    const expiredDate = moment.unix(1578919396); // Expired 2020

    const staleMediaMessage = {
      sid: '123',
      mediaDetails: {
        hasExpired: false,
        expiration: expiredDate,
        url: 'https://media.us1.twilio.com/ME1234?Expires=1578919396',
      },
    };

    const initialState = {
      ...defaultState,
      currentChannel: {
        sid: 'someId',
        friendlyName: 'newChannel',
        status: 'unknown',
      },
      messages: [staleMediaMessage],
    };

    const expectedMessage = {
      sid: '123',
      mediaDetails: {
        hasExpired: true,
        expiration: expiredDate,
        url: 'https://media.us1.twilio.com/ME1234?Expires=1578919396',
      },
    };

    const action = {
      type: 'HANDLE_UPDATE_MEDIA_EXPIRES',
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      messages: [expectedMessage],
    });
  });

  it('returns correct state on HANDLE_SENDING_MEDIA', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HANDLE_SENDING_MEDIA',
      payload: { filename: 'someFile.txt' },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      inProgressMedia: ['someFile.txt'],
    });
  });

  it('returns correct state on HANDLE_MEDIA_SENT', () => {
    const initialState = {
      ...defaultState,
      inProgressMedia: ['someFile.txt', 'someOtherFile.text'],
    };

    const action = {
      type: 'HANDLE_MEDIA_SENT',
      payload: { filename: 'someFile.txt' },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      inProgressMedia: ['someOtherFile.text'],
    });
  });

  it('returns correct state on HANDLE_MEDIA_REJECTED', () => {
    const initialState = {
      ...defaultState,
      inProgressMedia: ['someFile.txt', 'someOtherFile.text'],
    };
    const errorReason = new Error('Whoops media error');
    const action = {
      type: 'HANDLE_MEDIA_REJECTED',
      payload: { filename: 'someFile.txt', reason: errorReason },
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      inProgressMedia: ['someOtherFile.text'],
    });
  });

  it('returns correct state on OPEN_CHANNEL_IMAGE_UPLOAD_MODAL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'OPEN_CHANNEL_IMAGE_UPLOAD_MODAL',
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      imageUploadModal: {
        isOpen: true,
      },
    });
  });

  it('returns correct state on CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL', () => {
    const initialState = {
      ...defaultState,
      imageUploadModal: {
        isOpen: true,
      },
    };

    const action = {
      type: 'CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL',
    };

    const nextState = athleteChat(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      imageUploadModal: {
        isOpen: false,
      },
    });
  });

  it('returns correct state on OPEN_MESSAGE_INFO_SIDE_PANEL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'OPEN_MESSAGE_INFO_SIDE_PANEL',
      payload: { messageIndex: 10 },
    };

    const nextState = athleteChat(defaultState, action);
    expect(nextState).toEqual({
      ...initialState,
      selectedMessageIndex: 10,
    });
  });
});
