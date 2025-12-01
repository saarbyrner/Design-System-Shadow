// @flow
/* eslint-disable no-use-before-define */
import moment from 'moment';
import type { ToastItem } from '@kitman/components/src/types';
import type { MediaDetails, TwilioMedia } from '@kitman/common/src/types/Media';
import { type Client } from '@twilio/conversations';
import type { Action as MessagingMembersModalActions } from './components/MessagingMembersModal/types';
import type { Action as ChannelSettingsSidePanelActions } from './components/ChannelSettingsSidePanel/types';
import type { Action as MessageInfoSidePanelActions } from './components/MessageInfoSidePanel/types';
import type {
  Action as ChannelMembersSidePanelActions,
  ChannelMembersUpdateStatus,
} from './components/ChannelMembersSidePanel/types';

export type GeneralStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERROR'
  | 'DENIED';

export type ChatContext = {
  identity: string,
  token: string,
};

// Temporary type until flow files created for Twilio conversations api
export type TwilioUserUpdateReason =
  | 'friendlyName'
  | 'attributes'
  | 'reachabilityOnline'
  | 'reachabilityNotifiable';

// Temporary type until flow files created for Twilio conversations api
export type TwilioParticipantUpdateReason =
  | 'attributes'
  | 'dateCreated'
  | 'dateUpdated'
  | 'roleSid'
  | 'lastReadMessageIndex'
  | 'lastReadTimestamp';

// Temporary types until flow files created for Twilio conversations api

export type TwilioUser = {
  identity: string, // User identity
  friendlyName: ?string,
  attributes: ?Object,
  isOnline: boolean,
};

export type TwilioParticipant = {
  attributes?: Object,
  dateCreated: any,
  dateUpdated: any,
  identity: string,
  lastReadMessageIndex: ?number,
  lastReadTimestamp: ?Date,
  // friendlyName: string, // Does it have this?
  sid: string, // The server-assigned unique identifier for the Participant
  getUser: () => Promise<TwilioUser>,
};

export type TwilioPaginator<T> = {
  hasNextPage: boolean,
  hasPrevPage: boolean,
  items: Array<T>,
  nextPage: () => Promise<TwilioPaginator<T>>,
  prevPage: () => Promise<TwilioPaginator<T>>,
};

type TwilioConversationLastMessage = {
  index?: number,
  dateCreated?: Date,
};

export const NOTIFICATION_LEVEL = Object.freeze({
  DEFAULT: 'default',
  MUTED: 'muted',
});

export type NotificationLevelType = $Values<typeof NOTIFICATION_LEVEL>;

export type TwilioConversation = {
  attributes: Object, // The Conversation's custom attributes
  dateCreated: Date, // The Date this Conversation was created
  dateUpdated: Date, // The Date this Conversation was last updated
  friendlyName: string, // The Conversation's name
  lastReadMessageIndex: ?number, // Index of the last Message the User has read in this Conversation
  lastMessage: TwilioConversationLastMessage, // Last Message sent to this Conversation
  // * @property {Conversation#NotificationLevel} notificationLevel - User Notification level for this Conversation
  sid: string, // The Conversation's unique system identifier
  status: 'notParticipating' | 'joined', // The Conversation's status
  uniqueName: string, // The Conversation's unique name
  notificationLevel: NotificationLevelType,
  getParticipants: () => Promise<Array<TwilioParticipant>>, // Get conversation participants
  getParticipantsCount: () => Promise<number>, // Get conversation participants count
  getMessages: (
    pageSize?: number,
    anchor?: number,
    direction?: 'backwards' | 'forward'
  ) => Promise<TwilioPaginator<TwilioMessage>>, // Get the messages
  getMessagesCount: () => Promise<number>, // Get messages count
  sendMessage: (message: string | FormData) => Promise<number>, // Send a message
  advanceLastReadMessageIndex: (index: number) => Promise<number>, // Advance Conversation's last read Message index to current read horizon
  updateLastReadMessageIndex: (index: number) => Promise<number>, // Set Conversation's last read message index to a specific message index
  leave: () => Promise<TwilioConversation>, // Leave the conversation
  removeAllListeners: (action: string) => TwilioConversation, // Return TwilioConversation to allow chain of removeAllListeners like a true EventEmitter
};

export type TwilioMessage = {
  author: string, // The name of the user that sent Message
  subject: ?string, // Message subject. Used only in email conversations
  body: string, // The body of the Message. Is null if Message is Media Message
  attributes: Object, // Message custom attributes
  dateCreated: Date, // When Message was created
  dateUpdated: Date, // When Message was updated
  index: number, // Index of Message in the Conversation's messages list
  lastUpdatedBy: string, // Identity of the last user that updated Message
  media: TwilioMedia, // Contains Media information (if present)
  participantSid: string, // Authoring Participant's server-assigned unique identifier
  sid: string, // The server-assigned unique identifier for Message
  type: 'text' | 'media', // Type of message: 'text' or 'media'
  conversation: TwilioConversation, // Conversation Message belongs to
  getParticipant: () => Promise<TwilioParticipant>,
};

export type KnownUserAttributes = {
  // NOTE: We have not defined the final structure of the user attributes yet
};

export type RoleNameValue =
  | 'channel user'
  | 'channel user - readonly'
  | 'channel admin';

export type KnownMemberAttributes = {
  role?: RoleNameValue,
};

export type ChannelMemberPermission = 'SEND' | 'VIEW';

export type UserRole = {
  identity: string,
  orgId: string,
  staffUserId: string,
  permissions: ChatPermissions,
};

export type MessagingMember = {
  messagingIdentity: string, // The id Chat API knows the user as
  userId: string, // The userId of athlete or staff member
  friendlyName?: string, // The displayable name
  memberKind: 'ATHLETE' | 'STAFF' | 'UNKNOWN',
  channelMemberSid?: string, // The member sid for a specific channel
  channelRole: ?RoleNameValue, // The role value for a specific channel
  lastReadMessageIndex?: ?number, // Where in the current channel has the member read to
  lastReadTimestamp?: ?string, // At what time (ISO 8601 string) did the member read their last message
};

export type CreatableChannelTypes = 'private' | 'direct';

export type SearchableChannel = {
  display_name: string,
  split_searchable_values: Array<string>,
  result_type: 'channel',
  identifier: string,
  avatar_url: ?string,
};

type SearchablePersonGroup = {
  type: 'squad',
  primary: boolean,
  name: string,
};

export type SearchablePerson = {
  display_name: string,
  split_searchable_values: Array<string>,
  result_type: 'staff' | 'athlete',
  user_id: number,
  identifier: string,
  position: ?string,
  position_group: ?string,
  groups: Array<SearchablePersonGroup>,
  permissions: Array<string>,
  avatar_url: ?string,
};

export type SearchableItem = SearchableChannel | SearchablePerson;

export type SearchableItemGroups = {
  staff: Array<SearchablePerson>,
  athletes: Array<SearchablePerson>,
  userChannels: Array<SearchableChannel>,
  directChannels: Array<SearchableChannel>,
};

export type athleteChatState = {
  username: string, // The Twilio identifier for the current user
  userFriendlyName: ?string, // To use when displaying the name the current user
  userRole: UserRole, // More details about the current user and what they are allowed do
  messages: Array<ChatMessage>, // The messages to display for the current channel
  selectedMessageIndex: ?number, // The index of the message the user is interacting with
  selectedMessageMediaChangedTime: ?string, // The time the message media changed ( Due to refreshing the media or becoming marked as expired)
  currentChannel: ?ChatChannel, // The active channel the user is looking at
  currentChannelExtraData: CurrentChannelExtraData, // Further details of the current channel ( we do not gather this data for channels you are not a part of )
  userChannels: Array<ChatChannel>, // The channels the user has joined
  directChannels: Array<ChatChannel>, // The channels the user has created / been added to for Direct Messaging another user
  channelMembersModal: {
    isOpen: boolean,
  },
  imageUploadModal: {
    isOpen: boolean,
  },
  generalStatus: GeneralStatus, // State the app is in during initial connection with Twilio
  inProgressMedia: Array<string>, // The names of Media Attachments the user is attempting to send
  searchableItemGroups: SearchableItemGroups, // Data structure to aid in searching for channels and users to DM
};

export type MessagingSidePanels =
  | 'ChannelCreation'
  | 'ChannelMembers'
  | 'ChannelSettings'
  | 'MessageInfo';

export type messagingSidePanelState = {
  activeSidePanel: ?MessagingSidePanels,
};

export type channelMembersSidePanelState = {
  updateRequestStatus: ChannelMembersUpdateStatus,
};

export type channelSettingsSidePanelState = {
  channelIconUrl: ?string,
};

export type appStatusState = {
  status: ?string,
  message: ?string,
};

export type toastsState = {
  toastItems: Array<ToastItem>,
};

export type ChatPermissions = {
  canViewMessaging: boolean,
  canCreatePrivateChannel: boolean,
  canCreateDirectChannel: boolean,
  canAdministrateChannel: boolean,
};

export type ChatAuthorDetails = {
  authorName: string,
  friendlyName?: ?string,
  avatarUrl?: string,
  colourNumber?: number, // a number for the colour style we wish to apply to the author name.
};

export type MessageType = 'LOG' | 'ME' | 'THEM';

export type ChatMessage = {
  messageType: MessageType,
  body: ?string,
  index: number, // Index of Message in the Channel's messages list: To help with sorting and pagination
  sid?: string,
  authorDetails: ?ChatAuthorDetails,
  time?: string,
  date?: moment,
  media?: TwilioMedia,
  mediaDetails?: MediaDetails,
};

export type CurrentChannelExtraData = {
  hasUnretrievedNewerMessages: boolean,
  hasUnretrievedOlderMessages: boolean,
  fetchMessagesStatus: RequestStatus,
  memberRole: ?'channel user' | 'channel user - readonly' | 'channel admin',
  members?: Array<MessagingMember>,
};

export type DirectMessageParticipant = {
  identity: string,
  friendlyName: string,
};

export type DirectMessageParticipants = {
  target: DirectMessageParticipant,
  creator: DirectMessageParticipant,
};

export const CHANNEL_CREATION = Object.freeze({
  PRIVATE: 'private',
  DIRECT: 'direct',
});

export type ChannelCreationType = $Values<typeof CHANNEL_CREATION>;

export type ChatChannel = {
  sid: string,
  friendlyName: string,
  isPublic: boolean,
  isMuted: boolean, // Whether the current user has muted the notifications for this channel
  status: 'unknown' | 'notParticipating' | 'invited' | 'joined',
  lastConsumedMessageIndex: number, // Index of last message user read
  lastMessageIndex?: number, // Index of the last message in the channel ( not necessarily the last in our state messages)
  shortName: string,
  unreadMessagesCount: number,
  description: ?string,
  creationType: ?ChannelCreationType,
  directMessageParticipants?: DirectMessageParticipants,
  uniqueName: ?string,
  dateCreated: moment, // The Date the Channel was created
  membersCount: number, // Number of members in a channel
  messagesCount: number, // Number of messages in a channel
  avatarUrl?: string, // The url of the channel image if set
  attributes: ?Object, // The raw attributes object of a channel, useful for updating
};

export type RequestStatus =
  | 'NOT_REQUESTED_YET'
  | 'FETCHING'
  | 'FETCH_COMPLETE'
  | 'FETCH_ERROR';

type handleUsernameReceived = {
  type: 'HANDLE_USERNAME_RECEIVED',
  payload: {
    username: string,
  },
};

type handleMessageSent = {
  type: 'HANDLE_MESSAGE_SENT',
  payload: {
    messageIndex: number,
  },
};

type handleNewMessage = {
  type: 'HANDLE_NEW_MESSAGE',
  payload: {
    message: ChatMessage,
    channelId?: string,
  },
};

type handleNewMessageBatch = {
  type: 'HANDLE_NEW_MESSAGE_BATCH',
  payload: {
    channelId: string,
    messages: Array<ChatMessage>,
    listAction: 'APPEND' | 'PREPEND',
    hasAnotherPage: boolean,
    hasPageOtherDirection: boolean,
  },
};

type handleChangedChannel = {
  type: 'HANDLE_CHANGED_CHANNEL',
  payload: {
    channel: ChatChannel,
    memberAttributes: ?KnownMemberAttributes,
  },
};

type handleJoinedAChannel = {
  type: 'HANDLE_JOINED_A_CHANNEL',
  payload: {
    channel: ChatChannel,
  },
};

type handleLeftAChannel = {
  type: 'HANDLE_LEFT_A_CHANNEL',
  payload: {
    sid: string,
  },
};

type handleChannelListUpdated = {
  type: 'HANDLE_CHANNEL_LIST_UPDATED',
  payload: {
    channels: Array<ChatChannel>,
    channelType: 'USER' | 'DIRECT',
  },
};

type handleFetchMessagesStatus = {
  type: 'HANDLE_FETCH_MESSAGES_STATUS',
  payload: {
    requestStatus: RequestStatus,
  },
};

type handleChannelUpdated = {
  type: 'HANDLE_CHANNEL_UPDATED',
  payload: {
    channel: ChatChannel,
  },
};

type handleMessagesRead = {
  type: 'HANDLE_MESSAGES_READ',
  payload: {
    channelId: string,
    remainingUnreadCount: number,
  },
};

type handleUserDetailsReceived = {
  type: 'HANDLE_USER_DETAILS_RECEIVED',
  payload: {
    username: string,
    friendlyName: string,
    userAttributes: ?KnownUserAttributes,
  },
};

type handleCurrentChannelMemberUpdated = {
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED',
  payload: {
    memberIdentity: string,
    memberAttributes: ?KnownMemberAttributes,
    lastReadMessageIndex: ?number,
    lastReadTimestamp: ?string,
  },
};

type handleGeneralStatusChanged = {
  type: 'HANDLE_GENERAL_STATUS_CHANGED',
  payload: {
    status: GeneralStatus,
  },
};

type handleChannelCreated = {
  type: 'HANDLE_CHANNEL_CREATED',
  payload: {
    channelId: string,
  },
};

type handleRefreshMediaMessage = {
  type: 'HANDLE_REFRESH_MEDIA_MESSAGE',
  payload: {
    channelId: string,
    messageSid: string,
    url: string,
  },
};

type handleUpdateMediaExpires = {
  type: 'HANDLE_UPDATE_MEDIA_EXPIRES',
};

type handleSendingMedia = {
  type: 'HANDLE_SENDING_MEDIA',
  payload: {
    filename: string,
  },
};

type handleMediaSent = {
  type: 'HANDLE_MEDIA_SENT',
  payload: {
    filename: string,
  },
};

type handleMessageRejected = {
  type: 'HANDLE_MESSAGE_REJECTED',
  payload: {
    messageBody: string,
    reason: Error,
  },
};

// For when a media message was not sent successfully
type handleMediaRejected = {
  type: 'HANDLE_MEDIA_REJECTED',
  payload: {
    filename: string,
    reason: Error,
  },
};

type checkChannelExistsStart = {
  type: 'CHECK_CHANNEL_EXISTS_START',
};

type checkChannelExistsSuccess = {
  type: 'CHECK_CHANNEL_EXISTS_SUCCESS',
};

type checkChannelExistsFailure = {
  type: 'CHECK_CHANNEL_EXISTS_FAILURE',
};

// For when we need to know the latest members of a channel
type updateCurrentChannelMembers = {
  type: 'UPDATE_CURRENT_CHANNEL_MEMBERS',
  payload: {
    members: Array<MessagingMember>,
  },
};

type openChannelImageUploadModal = {
  type: 'OPEN_CHANNEL_IMAGE_UPLOAD_MODAL',
};

type closeChannelImageUploadModal = {
  type: 'CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL',
};

type handleMemberLeft = {
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_LEFT',
  payload: {
    memberIdentity: string,
  },
};

type handleMemberJoined = {
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_JOINED',
  payload: {
    member: MessagingMember,
  },
};

export type Action =
  | handleUsernameReceived
  | handleMessageSent
  | handleNewMessage
  | handleChangedChannel
  | handleJoinedAChannel
  | handleLeftAChannel
  | handleChannelListUpdated
  | handleNewMessageBatch
  | handleFetchMessagesStatus
  | handleChannelUpdated
  | handleMessagesRead
  | handleUserDetailsReceived
  | handleCurrentChannelMemberUpdated
  | handleGeneralStatusChanged
  | handleChannelCreated
  | handleRefreshMediaMessage
  | handleUpdateMediaExpires
  | handleSendingMedia
  | handleMediaSent
  | handleMessageRejected
  | handleMediaRejected
  | checkChannelExistsStart
  | checkChannelExistsSuccess
  | checkChannelExistsFailure
  | updateCurrentChannelMembers
  | openChannelImageUploadModal
  | closeChannelImageUploadModal
  | handleMemberLeft
  | handleMemberJoined;

type Dispatch = (
  action:
    | Action
    | MessagingMembersModalActions
    | ChannelMembersSidePanelActions
    | ChannelSettingsSidePanelActions
    | MessageInfoSidePanelActions
    | ThunkAction
) => any;
type GetState = () => athleteChatState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

export type MessagingState = {
  totalUnread: number,
  conversationMap: { [sid: string]: number },
};

export type UpdateNotificationLevel = {
  client: Client,
  sid: string,
  level: NotificationLevelType,
  onSuccess?: () => void,
  onError?: () => void,
};
