// @flow
import $ from 'jquery';
import _findLast from 'lodash/findLast';
import { Client } from '@twilio/conversations';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import uuid from 'uuid';
import debounce from 'lodash/debounce';
import type { AthletesAndStaffSelection } from '@kitman/components/src/types';
import type { MediaDetails, TwilioMedia } from '@kitman/common/src/types/Media';
import { createMediaDetails } from '@kitman/common/src/utils/mediaHelper';
import type {
  ChatChannel,
  ChatMessage,
  ChatAuthorDetails,
  DirectMessageParticipants,
  TwilioConversation,
  TwilioUserUpdateReason,
  TwilioParticipant,
  TwilioUser,
  TwilioMessage,
  Action,
  ThunkAction,
  RequestStatus,
  KnownUserAttributes,
  KnownMemberAttributes,
  GeneralStatus,
  CreatableChannelTypes,
  MessagingMember,
} from './types';
import type { Action as ChannelMembersSidePanelActions } from './components/ChannelMembersSidePanel/types';
import type { Action as ChannelSettingsSidePanelActions } from './components/ChannelSettingsSidePanel/types';

import {
  channelMembersUpdateInProgress,
  channelMembersUpdateComplete,
  channelMembersUpdateFailed,
} from './components/ChannelMembersSidePanel/actions';

import {
  closeChannelSettingsSidePanel,
  channelSettingsUpdatedIcon,
  channelSettingsUpdateInProgress,
  channelSettingsUpdateComplete,
  channelSettingsUpdateFailed,
  channelSettingsUploadingIconStarted,
  channelSettingsUploadingIconFailure,
  channelSettingsUploadingIconSuccess,
  hideAppStatus,
} from './components/ChannelSettingsSidePanel/actions';

import {
  getMessagesFromMessageIndex,
  getAndConvertAllConversations,
} from './paginationHelper';
import {
  getMessageType,
  getMessageTimeString,
  getMessageDateAsMoment,
  removeConversationListeners,
  convertAConversationToChatChannel,
  convertUserToChatAuthorDetails,
  convertUserToMessagingMembers,
  getChatIdentityForUser,
  getDirectMessageChannelUniqueName,
} from './utils';

// For when a the chat client tells us the user identity ( username )
export const handleUsernameReceived = (username: string): Action => ({
  type: 'HANDLE_USERNAME_RECEIVED',
  payload: {
    username,
  },
});

// For when a the chat client user attributes are updated

export const handleUserDetailsReceived = (
  username: string,
  friendlyName: string,
  userAttributes: ?KnownUserAttributes
): Action => ({
  type: 'HANDLE_USER_DETAILS_RECEIVED',
  payload: {
    username,
    friendlyName,
    userAttributes,
  },
});

// For when a message is received from the chat client ( Could be from our user )
export const handleNewMessage = (
  body: string,
  messageType: 'LOG' | 'ME' | 'THEM',
  index: number = -1, // NOTE: Default is for Local Log messages. The reducer will set their index to the end of the messages
  sid?: string,
  channelId?: string, // If undefined we assume is current channel. (Likely a lOG message)
  authorDetails?: ChatAuthorDetails,
  time?: string,
  date?: moment,
  media?: TwilioMedia,
  mediaDetails?: MediaDetails
): Action => ({
  type: 'HANDLE_NEW_MESSAGE',
  payload: {
    channelId,
    message: {
      messageType,
      body,
      index,
      sid,
      authorDetails: authorDetails || {
        authorName: messageType === 'ME' ? i18n.t('You') : i18n.t('Them'),
      },
      time,
      date,
      media,
      mediaDetails,
    },
  },
});

// For when the chat client confirms the user has sent a message
export const handleMessageSent = (messageIndex: number): Action => ({
  type: 'HANDLE_MESSAGE_SENT',
  payload: {
    messageIndex,
  },
});

// For when a message was not sent successfully
export const handleMessageRejected = (
  messageBody: string,
  reason: Error
): Action => ({
  type: 'HANDLE_MESSAGE_REJECTED',
  payload: {
    messageBody,
    reason,
  },
});

// For when a channel list has been updated
export const handleChannelListUpdated = (
  channels: Array<ChatChannel>,
  channelType: 'USER' | 'DIRECT'
): Action => ({
  type: 'HANDLE_CHANNEL_LIST_UPDATED',
  payload: {
    channels,
    channelType,
  },
});

// For when have successfully switched channel
export const handleChangedChannel = (
  channel: ChatChannel,
  memberAttributes: ?KnownMemberAttributes
): Action => ({
  type: 'HANDLE_CHANGED_CHANNEL',
  payload: {
    channel,
    memberAttributes,
  },
});

// For when have successfully left a channel
export const handleLeftAChannel = (sid: string): Action => ({
  type: 'HANDLE_LEFT_A_CHANNEL',
  payload: {
    sid,
  },
});

// For when our user joins a channel
export const handleJoinedAChannel = (channel: ChatChannel): Action => ({
  type: 'HANDLE_JOINED_A_CHANNEL',
  payload: {
    channel,
  },
});

// For when a group of messages is retrieved for the channel
export const handleNewMessageBatch = (
  channelId: string,
  messages: Array<ChatMessage>,
  listAction: 'APPEND' | 'PREPEND',
  hasAnotherPage: boolean,
  hasPageOtherDirection: boolean
): Action => ({
  type: 'HANDLE_NEW_MESSAGE_BATCH',
  payload: {
    channelId,
    messages,
    listAction,
    hasAnotherPage,
    hasPageOtherDirection,
  },
});

// For when the status of fetching messages changes
export const handleFetchMessagesStatus = (
  requestStatus: RequestStatus
): Action => ({
  type: 'HANDLE_FETCH_MESSAGES_STATUS',
  payload: {
    requestStatus,
  },
});

export const handleChannelUpdated = (channel: ChatChannel): Action => ({
  type: 'HANDLE_CHANNEL_UPDATED',
  payload: {
    channel,
  },
});

export const handleMessagesRead = (
  channelId: string,
  remainingUnreadCount: number
): Action => ({
  type: 'HANDLE_MESSAGES_READ',
  payload: {
    channelId,
    remainingUnreadCount,
  },
});

export const handleCurrentChannelMemberUpdated = (
  memberIdentity: string,
  memberAttributes: ?KnownMemberAttributes,
  lastReadMessageIndex: ?number,
  lastReadTimestamp: ?string
): Action => ({
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED',
  payload: {
    memberIdentity,
    memberAttributes,
    lastReadMessageIndex,
    lastReadTimestamp,
  },
});

export const handleMemberLeft = (memberIdentity: string): Action => ({
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_LEFT',
  payload: {
    memberIdentity,
  },
});

export const handleMemberJoined = (member: MessagingMember): Action => ({
  type: 'HANDLE_CURRENT_CHANNEL_MEMBER_JOINED',
  payload: {
    member,
  },
});

export const handleGeneralStatusChanged = (status: GeneralStatus): Action => ({
  type: 'HANDLE_GENERAL_STATUS_CHANGED',
  payload: {
    status,
  },
});

// For when have successfully created a channel
export const handleChannelCreated = (channelId: string): Action => ({
  type: 'HANDLE_CHANNEL_CREATED',
  payload: {
    channelId,
  },
});

// For when have an updated url to set for an existing message
export const handleRefreshMediaMessage = (
  channelId: string,
  messageSid: string,
  url: string
): Action => ({
  type: 'HANDLE_REFRESH_MEDIA_MESSAGE',
  payload: {
    channelId,
    messageSid,
    url,
  },
});

// For a periodic check if media has expired
export const handleUpdateMediaExpires = (): Action => ({
  type: 'HANDLE_UPDATE_MEDIA_EXPIRES',
});

// For when about to send media message
export const handleSendingMedia = (filename: string): Action => ({
  type: 'HANDLE_SENDING_MEDIA',
  payload: {
    filename,
  },
});

// For when a media message sent successfully
export const handleMediaSent = (filename: string): Action => ({
  type: 'HANDLE_MEDIA_SENT',
  payload: {
    filename,
  },
});

// For when a media message was not sent successfully
export const handleMediaRejected = (
  filename: string,
  reason: Error
): Action => ({
  type: 'HANDLE_MEDIA_REJECTED',
  payload: {
    filename,
    reason,
  },
});

export const checkChannelExistsStart = (): Action => ({
  type: 'CHECK_CHANNEL_EXISTS_START',
});

export const checkChannelExistsSuccess = (): Action => ({
  type: 'CHECK_CHANNEL_EXISTS_SUCCESS',
});

export const checkChannelExistsFailure = (): Action => ({
  type: 'CHECK_CHANNEL_EXISTS_FAILURE',
});

export const updateCurrentChannelMembers = (
  members: Array<MessagingMember>
): Action => ({
  type: 'UPDATE_CURRENT_CHANNEL_MEMBERS',
  payload: {
    members,
  },
});

// ================ COMPLEX ACTIONS ================

// For when the user scrolls though messages
export const markConversationMessagesRead =
  (
    activeConversation: TwilioConversation,
    readToMessageIndex: number
  ): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    return new Promise<void>((resolve: (value: any) => void) => {
      if (activeConversation) {
        activeConversation
          .advanceLastReadMessageIndex(readToMessageIndex)
          .then((remainingUnreadCount) => {
            dispatch(
              handleMessagesRead(activeConversation.sid, remainingUnreadCount)
            );
            resolve();
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            // Likely user does not have permission level to mark messages as read for this channel
            // Will ignore error as not user friendly to add a log message for this
          });
      } else {
        resolve();
      }
    });
  };

// For when user will scroll to bottom of the list of messages and they have yet to receive the page with the latest message
export const requestNextPageOfMessages =
  (activeChannel: TwilioConversation): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      // Get the index of the last real message in our state ( exclude logs )
      let lastIndex = 0;
      const messages = getState().athleteChat.messages;
      if (messages?.length > 0) {
        const nonLogMessage = _findLast(
          messages,
          (message) => message.messageType !== 'LOG'
        );
        if (nonLogMessage) {
          lastIndex = nonLogMessage.index;
        }
      }
      dispatch(handleFetchMessagesStatus('FETCHING'));
      // Only load more messages if we haven't reached the end
      if (
        activeChannel.lastMessage &&
        activeChannel.lastMessage.index !== lastIndex
      ) {
        const channelId = activeChannel.sid;
        const username = getState().athleteChat.username;
        getMessagesFromMessageIndex(
          Math.max(0, lastIndex + 1),
          'forward',
          activeChannel,
          false, // Not recursive
          50,
          username
        )
          .then((messageResult) => {
            dispatch(
              handleNewMessageBatch(
                channelId,
                messageResult.messages,
                'APPEND',
                messageResult.hasAnotherPage,
                messageResult.hasPageOtherDirection
              )
            );
            dispatch(handleFetchMessagesStatus('FETCH_COMPLETE'));
            resolve();
          })
          .catch((error) => {
            dispatch(handleFetchMessagesStatus('FETCH_ERROR'));
            reject(Error(`Failed to fetch next messages: ${error}`));
          });
      } else {
        dispatch(handleFetchMessagesStatus('FETCH_COMPLETE')); // No op
        resolve();
      }
    });
  };

// For when user will scroll to top of the list of messages and they have yet to receive the page with the first message
export const requestPreviousPageOfMessages =
  (activeChannel: TwilioConversation): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      dispatch(handleFetchMessagesStatus('FETCHING'));
      // Get the message index of the oldest message in our state
      let firstIndex = 0;
      const messages = getState().athleteChat.messages;
      if (messages?.length > 0) {
        const nonLogMessage = messages.find(
          (message) => message.messageType !== 'LOG'
        );
        if (nonLogMessage) {
          firstIndex = nonLogMessage.index;
        }
      }

      // Only load more messages if we haven't reached the top
      if (
        firstIndex !== 0 // NOTE: Once message deletion is possible will need to be smarter. Have idea.
      ) {
        const username = getState().athleteChat.username;
        const channelId = activeChannel.sid;
        getMessagesFromMessageIndex(
          Math.max(0, firstIndex - 1),
          'backwards',
          activeChannel,
          false, // Not recursive
          50,
          username
        )
          .then((messageResult) => {
            dispatch(
              handleNewMessageBatch(
                channelId,
                messageResult.messages,
                'PREPEND',
                messageResult.hasAnotherPage,
                messageResult.hasPageOtherDirection
              )
            );
            dispatch(handleFetchMessagesStatus('FETCH_COMPLETE'));
            resolve();
          })
          .catch((error) => {
            dispatch(handleFetchMessagesStatus('FETCH_ERROR'));
            reject(Error(`Failed to fetch previous messages: ${error}`));
          });
      } else {
        dispatch(handleFetchMessagesStatus('FETCH_COMPLETE')); // No op
        resolve();
      }
    });
  };

// For when our user requests to send a message ( or a log message needs to be displayed )
export const sendNewMessage =
  (
    messageText: string,
    messageType: 'LOG' | 'ME',
    activeChannel: TwilioConversation
  ): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    if (activeChannel && messageType === 'ME') {
      activeChannel.sendMessage(messageText).then(
        (messageResult: number) => {
          dispatch(handleMessageSent(messageResult));
        },
        (reason: Error) => {
          dispatch(handleMessageRejected(messageText, reason));
        }
      );
    } else {
      dispatch(handleNewMessage(messageText, 'LOG'));
    }
  };

// For when our user requests to send a media message
export const sendMedia =
  (files: [], activeChannel: TwilioConversation): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    if (activeChannel) {
      files.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file);

        dispatch(handleSendingMedia(file.name));

        activeChannel.sendMessage(formData).then(
          (messageIndex: number) => {
            dispatch(handleMediaSent(file.name));
            dispatch(handleMessageSent(messageIndex));
          },
          (reason: Error) => {
            dispatch(handleMediaRejected(file.name, reason));
          }
        );
      });
    }
  };

// For when we request a refresh of both twilio conversation types ( Split into User and Direct Message )
export const refreshConversationLists =
  (chatClient: Client): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    return new Promise<void>((resolve: (value: any) => void) => {
      const conversationsRefreshFunction = async () => {
        const conversationPaginator =
          await chatClient.getSubscribedConversations();
        const conversations = await getAndConvertAllConversations(
          conversationPaginator,
          chatClient
        );
        dispatch(
          handleChannelListUpdated(
            conversations.filter((ch) => ch.creationType !== 'direct'),
            'USER'
          )
        );
        dispatch(
          handleChannelListUpdated(
            conversations.filter((ch) => ch.creationType === 'direct'),
            'DIRECT'
          )
        );
      };

      conversationsRefreshFunction().then(() => {
        // Only once we have gotten the Conversations then subscribe for changes.
        // Check we listenerCount to ensure we have not subscribed before.
        // Add a debounce as when the client starts 'channelAdded' gets called for every channel you are a member of
        if (chatClient.listenerCount('conversationAdded') === 0) {
          chatClient.on(
            'conversationAdded',
            debounce(conversationsRefreshFunction, 250)
          );
        }
        resolve();
      });
    });
  };

/* eslint-disable max-nested-callbacks */
// For when we want to create the chat client and subscribe for events
export const createConversationsClient =
  (token: string, assignConversationsClient: Function): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      try {
        const conversationsClient = new Client(token);

        conversationsClient.on('initFailed', ({ error }) => {
          dispatch(handleGeneralStatusChanged('ERROR'));
          reject(Error(`Failed to init client: ${error}`));
        });
        conversationsClient.on('initialized', () => {
          // Use the client
          assignConversationsClient(conversationsClient);
          const username = conversationsClient.user.identity;
          dispatch(
            handleUsernameReceived(
              conversationsClient.user.identity // This user name will be or format 'orgId||athleteId'
            )
          );
          dispatch(
            handleUserDetailsReceived(
              conversationsClient.user.identity, // This user name will be or format 'orgId||athleteId'
              conversationsClient.user.friendlyName,
              conversationsClient.user.attributes
            )
          );

          conversationsClient.on('connectionError', () => {
            dispatch(handleGeneralStatusChanged('DISCONNECTED'));
          });

          conversationsClient.on('connectionStateChanged', (clientState) => {
            // $FlowFixMe Twilio types match the strings we have when in uppercase
            const status: GeneralStatus = clientState.toUpperCase();
            dispatch(handleGeneralStatusChanged(status));
            if (status === 'DENIED') {
              window.location.reload(false); // Temporary solution to force an access token to be regenerated
            }
          });

          conversationsClient.user.on(
            'updated',
            (
              updateReasons: TwilioUserUpdateReason | TwilioUserUpdateReason[]
            ) => {
              // Refresh the details for our user for any reason
              if (updateReasons) {
                dispatch(
                  handleUserDetailsReceived(
                    conversationsClient.user.identity, // This user name will be or format 'orgId||athleteId'
                    conversationsClient.user.friendlyName,
                    conversationsClient.user.attributes
                  )
                );
              }
            }
          );

          // NOTE: Add relevant client callbacks here

          conversationsClient.on('tokenAboutToExpire', () => {
            window.location.reload(false); // Temporary solution
          });

          conversationsClient.on('tokenAboutToExpire', () => {
            window.location.reload(false); // Temporary solution
          });

          conversationsClient.on('tokenExpired', () => {
            window.location.reload(false); // Temporary solution
          });

          conversationsClient.on(
            'conversationJoined',
            (conversation: TwilioConversation) => {
              convertAConversationToChatChannel(conversation, username).then(
                (convertedChannel: ?ChatChannel) => {
                  if (convertedChannel) {
                    dispatch(handleJoinedAChannel(convertedChannel));
                  }
                }
              );
            }
          );

          conversationsClient.on('conversationUpdated', ({ conversation }) => {
            convertAConversationToChatChannel(conversation, username).then(
              (convertedChannel: ?ChatChannel) => {
                if (convertedChannel) {
                  dispatch(handleChannelUpdated(convertedChannel)); // Can add updateReasons later if desired
                }
              }
            );
            // May want to dispatch specific actions based on updateObj.reasons
          });

          const conversationsRefreshFunction = () => {
            conversationsClient
              .getSubscribedConversations()
              .then((conversationPaginator) => {
                getAndConvertAllConversations(
                  conversationPaginator,
                  conversationsClient
                ).then((conversations) => {
                  // Split out directMessage channels from user channels
                  dispatch(
                    handleChannelListUpdated(
                      conversations.filter(
                        (c) => c != null && c.creationType !== 'direct'
                      ),
                      'USER'
                    )
                  );
                  dispatch(
                    handleChannelListUpdated(
                      conversations.filter(
                        (c) => c != null && c.creationType === 'direct'
                      ),
                      'DIRECT'
                    )
                  );
                });
              });
          };

          // NOTE: Subscription to 'channelAdded' event is dealt with in refreshChannelLists action
          conversationsClient.on(
            'conversationRemoved',
            conversationsRefreshFunction
          );
          conversationsClient.on(
            'conversationLeft',
            conversationsRefreshFunction
          );
          conversationsClient.on('messageAdded', (message: TwilioMessage) => {
            message.getParticipant().then((participant: TwilioParticipant) => {
              participant.getUser().then((user: TwilioUser) => {
                // NOTE: reducer will check if message is from our current channel before adding to messages list
                if (message.type === 'media') {
                  message.media.getContentTemporaryUrl().then((url) => {
                    const mediaDetails = createMediaDetails(url, message.media);

                    dispatch(
                      handleNewMessage(
                        message.body,
                        getMessageType(message, username),
                        message.index,
                        message.sid,
                        message.conversation.sid,
                        convertUserToChatAuthorDetails(user, message.author),
                        getMessageTimeString(message),
                        getMessageDateAsMoment(message),
                        message.media,
                        mediaDetails
                      )
                    );
                  });
                } else {
                  dispatch(
                    handleNewMessage(
                      message.body,
                      getMessageType(message, username),
                      message.index,
                      message.sid,
                      message.conversation.sid,
                      convertUserToChatAuthorDetails(user, message.author),
                      getMessageTimeString(message),
                      getMessageDateAsMoment(message)
                    )
                  );
                }
              });
            });
          });
          dispatch(handleGeneralStatusChanged('CONNECTED'));
          resolve(conversationsClient);
        });
      } catch (error) {
        dispatch(handleGeneralStatusChanged('ERROR'));
        reject(Error(`Failed to create chat client: ${error}`));
      }
    });
  };
/* eslint-enable max-nested-callbacks */

// When our user wants an updated url for a message.
export const refreshMediaMessage =
  (channelId: string, messageSid: string): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      const currentMessages = getState().athleteChat.messages;
      const messageToUpdate = currentMessages.find(
        (message) => message.sid === messageSid
      );

      if (messageToUpdate) {
        messageToUpdate.media
          .getContentTemporaryUrl()
          .then((url) => {
            dispatch(handleRefreshMediaMessage(channelId, messageSid, url));
            resolve(url);
          })
          .catch((error) => {
            reject(Error(`Failed to update media message: ${error}`));
          });
      } else {
        reject(Error(`Failed to update media message`));
      }
    });
  };

// When our user wants to make changes to the member list of a channel
export const addOrRemoveChannelMembers =
  (
    membersToRemove: Array<string>,
    membersToAdd: AthletesAndStaffSelection,
    staffCanSend: boolean,
    athletesCanSend: boolean
  ): ThunkAction =>
  (
    dispatch: (
      action: Action | ChannelMembersSidePanelActions
    ) => Action | ChannelMembersSidePanelActions,
    getState: Function
  ) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      dispatch(channelMembersUpdateInProgress());

      const channelSid = getState().athleteChat.currentChannel.sid;
      const membersToAddData = [];

      membersToAddData.push(
        ...membersToAdd.staff.map((userId) => {
          return {
            user: Number(userId),
            role: staffCanSend ? 'channel user' : 'channel user - readonly',
          };
        })
      );

      membersToAddData.push(
        ...membersToAdd.athletes.map((userId) => {
          return {
            user: Number(userId),
            role: athletesCanSend ? 'channel user' : 'channel user - readonly',
          };
        })
      );

      const requestDetails: any = {
        channel_sid: channelSid,
        removed_member_sids:
          membersToRemove.length > 0 ? membersToRemove : undefined,
        add_members: membersToAddData.length > 0 ? membersToAddData : undefined,
      };

      $.ajax({
        method: 'POST',
        url: `messaging/members`,
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        contentType: 'application/json',
        data: JSON.stringify(requestDetails),
        cache: false,
        error: () => {
          // This is needed to trap potential 'Sentry Ignore - Unprocessable Entity' error
        },
      })
        .done((response) => {
          dispatch(channelMembersUpdateComplete());
          resolve(response);
        })
        .fail(() => {
          dispatch(channelMembersUpdateFailed());
          reject(Error(i18n.t(`Failed to update channel members`)));
        });
    });
  };

// When our user wants to upload an image to later set as the channel avatar / icon
export const uploadConversationIcon =
  (icon: File): ThunkAction =>
  (
    dispatch: (
      action: Action | ChannelSettingsSidePanelActions
    ) => Action | ChannelSettingsSidePanelActions,
    getState: Function
  ) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      dispatch(channelSettingsUploadingIconStarted(icon.name));

      const currentChannel = getState().athleteChat.currentChannel;
      const formData = new FormData();
      const frontendUuid = uuid.v4();
      formData.append('icon', icon);
      formData.append('frontend_uuid', frontendUuid);
      formData.append('sid', currentChannel.sid);

      $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: '/messaging/conversation_icons',
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        error: () => {
          // This is needed to trap potential 'Sentry Ignore - Unprocessable Entity' error
        },
      })
        .done((response) => {
          dispatch(channelSettingsUpdatedIcon(response.uri));
          dispatch(channelSettingsUploadingIconSuccess(icon.name));
          setTimeout(() => {
            resolve(response.uri);
          }, 1000);
        })
        .fail((xhr: XMLHttpRequest) => {
          dispatch(channelSettingsUploadingIconFailure(icon.name));
          reject(
            Error(`Failed to upload conversation icon: ${xhr.responseText}`)
          );
        });
    });
  };

// When our user wants to change the details of an existing channel
export const updateChannelDetails =
  (
    channelSid: string,
    channelName: string,
    channelDescription: ?string,
    channelAvatarUrl: ?string
  ): ThunkAction =>
  (
    dispatch: (
      action: Action | ChannelSettingsSidePanelActions
    ) => Action | ChannelSettingsSidePanelActions,
    getState: Function
  ) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      const currentChannel = getState().athleteChat.currentChannel;

      if (currentChannel.sid !== channelSid) {
        dispatch(closeChannelSettingsSidePanel());
        reject();
      }
      dispatch(channelSettingsUpdateInProgress());

      const attributes = currentChannel.attributes;
      let updatedAttributes = {};
      if (attributes) {
        updatedAttributes = { ...attributes };
      }
      updatedAttributes.channelDescription = channelDescription;
      if (channelAvatarUrl) {
        updatedAttributes.channelAvatarUrl = channelAvatarUrl;
      }

      const updateDetails: any = {
        channel_sid: channelSid,
        friendly_name: channelName,
        attributes: JSON.stringify(updatedAttributes),
        unique_name: channelName.toLowerCase(),
        is_private: true,
      };

      $.ajax({
        method: 'PUT',
        url: `messaging/channels/${channelSid}`,
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        contentType: 'application/json',
        data: JSON.stringify(updateDetails),
        cache: false,
        error: () => {
          // This is needed to trap potential 'Sentry Ignore - Unprocessable Entity' error
        },
      })
        .done((response) => {
          if (response.success) {
            dispatch(channelSettingsUpdateComplete());
            setTimeout(() => {
              dispatch(hideAppStatus());
              dispatch(closeChannelSettingsSidePanel());
              resolve();
            }, 1000);
          } else if (response.errors?.unique_name) {
            dispatch(channelSettingsUpdateFailed('FAILURE_NAME_IN_USE'));
          } else {
            dispatch(channelSettingsUpdateFailed('OTHER_ERROR'));
          }
        })
        .fail((xhr: XMLHttpRequest) => {
          dispatch(channelSettingsUpdateFailed('OTHER_ERROR'));
          reject(Error(`Failed to update channel: ${xhr.responseText}`));
        });
    });
  };

// When our user wants to make a new conversation
export const createConversation =
  (
    client: Client,
    channelType: CreatableChannelTypes,
    channelName: string,
    channelDescription: ?string,
    channelMembers: AthletesAndStaffSelection,
    staffCanSend: boolean,
    athletesCanSend: boolean,
    channelSid: ?string,
    directMessageTargetFriendlyName?: string
  ): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    return new Promise<string | void>(
      (resolve: (value: any) => void, reject) => {
        const membersData = [];

        membersData.push(
          ...channelMembers.staff.map((userId) => {
            return {
              user: Number(userId),
              role: staffCanSend ? 'channel user' : 'channel user - readonly',
            };
          })
        );

        membersData.push(
          ...channelMembers.athletes.map((userId) => {
            return {
              user: Number(userId),
              role: athletesCanSend
                ? 'channel user'
                : 'channel user - readonly',
            };
          })
        );

        let directMessageParticipants: DirectMessageParticipants;
        let uniqueName;

        if (channelType === 'direct') {
          const creatorOrg = client.user.identity.split('||')[0];

          let targetUserId = '';
          if (channelMembers.athletes.length > 0) {
            targetUserId = channelMembers.athletes[0];
          }
          if (channelMembers.staff.length > 0) {
            targetUserId = channelMembers.staff[0];
          }

          const targetIdentity = getChatIdentityForUser(
            creatorOrg,
            // $FlowIssue[incompatible-call] targetUserID is a string.
            targetUserId
          );
          uniqueName = getDirectMessageChannelUniqueName(
            client.user.identity,
            targetIdentity
          );

          directMessageParticipants = {
            target: {
              identity: targetIdentity,
              friendlyName: directMessageTargetFriendlyName || targetIdentity,
            },
            creator: {
              identity: client.user.identity,
              friendlyName: client.user.friendlyName || client.user.identity,
            },
          };
          // Check if channel with that unique name already exists
          // If so return its sid
          client.getConversationByUniqueName(uniqueName).then(
            (conversation: TwilioConversation) => {
              resolve(conversation.sid);
            },
            () => {
              // Channel does not exist so create the channel
              const creationDetails = {
                friendly_name: uniqueName,
                attributes: JSON.stringify({
                  channelType,
                  channelDescription,
                  directMessageParticipants,
                }),
                is_private: true, // Direct channels are also private
                members: membersData.length > 0 ? membersData : undefined,
                unique_name: uniqueName,
              };

              $.ajax({
                method: 'POST',
                url: `messaging/channels`,
                headers: {
                  'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
                },
                contentType: 'application/json',
                data: JSON.stringify(creationDetails),
                cache: false,
                error: () => {
                  // This is needed to trap potential 'Sentry Ignore - Unprocessable Entity' error
                },
              })
                .done((response) => {
                  if (response.sid) {
                    dispatch(handleChannelCreated(response.sid));
                    resolve(response.sid);
                  } else {
                    reject(
                      Error(`Failed to create channel: no sid in response`)
                    );
                  }
                })
                .fail((xhr: XMLHttpRequest) => {
                  const response = JSON.parse(xhr.responseText);
                  if (response.errors?.unique_name) {
                    reject(Error('FAILURE_NAME_IN_USE'));
                  } else {
                    reject(Error('FAILURE_GENERAL_ERROR'));
                  }
                });
            }
          );
        } else {
          // Create non Direct message channel
          const creationDetails: any = {
            friendly_name: channelName,
            attributes: JSON.stringify({
              channelType,
              channelDescription,
              directMessageParticipants,
            }),
            is_private: channelType === 'private',
            members: membersData.length > 0 ? membersData : undefined,
            unique_name: channelName.toLowerCase(),
          };

          $.ajax({
            method: 'POST',
            url: `messaging/channels`,
            headers: {
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
            },
            contentType: 'application/json',
            data: JSON.stringify(creationDetails),
            cache: false,
            error: (error) => {
              /**
               * ? *HOTFIX*
               * ? Unsure why this is not falling through to the .fail
               * ? This will all be migrated to use axios in near future
               * ? Tests will also be migrated from .spec to .test
               */
              if (error.status === 422) {
                reject(Error('FAILURE_NAME_IN_USE'));
              } else {
                reject(Error('FAILURE_GENERAL_ERROR'));
              }
            },
          })
            .done((response) => {
              if (response.sid) {
                dispatch(handleChannelCreated(response.sid));
                resolve(response.sid);
              } else if (response.errors?.unique_name) {
                reject(Error('FAILURE_NAME_IN_USE'));
              } else {
                reject(Error('FAILURE_GENERAL_ERROR'));
              }
            })
            .fail((xhr: XMLHttpRequest) => {
              const response = JSON.parse(xhr.responseText);
              if (response.errors?.unique_name) {
                reject(Error('FAILURE_NAME_IN_USE'));
              } else {
                reject(Error('FAILURE_GENERAL_ERROR'));
              }
            });
        }
      }
    );
  };

export const fetchConversationParticipants =
  (sid: string, client: Client): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      const staff = getState().athleteChat.searchableItemGroups.staff;
      const athletes = getState().athleteChat.searchableItemGroups.athletes;
      client
        .getConversationBySid(sid)
        .then((conversation) => {
          conversation
            .getParticipants()
            .then((participants: Array<TwilioParticipant>) => {
              Promise.all(participants.map((p) => p.getUser())).then(
                (users) => {
                  dispatch(
                    updateCurrentChannelMembers(
                      convertUserToMessagingMembers(
                        participants,
                        users,
                        staff,
                        athletes
                      )
                    )
                  );
                  resolve();
                }
              );
            });
        })
        .catch((error) => {
          dispatch(
            handleNewMessage(
              i18n.t('Failed to fetch members for channel'),
              'LOG'
            )
          );
          reject(Error(`Failed to fetch members for channel: ${error}`));
        });
    });
  };

/* eslint-disable max-nested-callbacks */
// When our user requests to change the active conversation to a different one
export const switchConversation =
  (
    sid: string,
    client: Client,
    activeConversation: ?TwilioConversation,
    assignActiveConversation: Function
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      if (!sid) {
        reject();
      }
      removeConversationListeners(activeConversation);
      client
        .getConversationBySid(sid)
        .then((conversation) => {
          assignActiveConversation(conversation);
          // NOTE: If a member joins of leaves while chat channel is active we show a local log message
          // If we want a record of these join/leave actions to be visible to people later joining chat timeline
          // then we probably need the joining member client to actually send a new notification message
          // (A notification type of message does not exist yet)

          removeConversationListeners(conversation);
          conversation.on('participantUpdated', (event) => {
            const currentConversation = getState().athleteChat.currentChannel;
            const reasons = Array.isArray(event.updateReasons)
              ? event.updateReasons
              : [event.updateReasons];

            const reasonCheck = (reason) =>
              reason === 'attributes' || reason === 'lastReadMessageIndex';

            if (
              currentConversation &&
              currentConversation.sid === conversation.sid &&
              reasons.some(reasonCheck)
            ) {
              dispatch(
                handleCurrentChannelMemberUpdated(
                  event.participant.identity,
                  event.participant.attributes,
                  event.participant.lastReadMessageIndex,
                  event.participant.lastReadTimestamp
                )
              );
            }
          });

          conversation.on(
            'participantJoined',
            (participant: TwilioParticipant) => {
              const currentConversation = getState().athleteChat.currentChannel;
              if (
                currentConversation &&
                currentConversation.sid === conversation.sid
              ) {
                participant.getUser().then((user: TwilioUser) => {
                  const staff =
                    getState().athleteChat.searchableItemGroups.staff;
                  const athletes =
                    getState().athleteChat.searchableItemGroups.athletes;
                  const member = convertUserToMessagingMembers(
                    [participant],
                    [user],
                    staff,
                    athletes
                  )[0];
                  dispatch(handleMemberJoined(member));
                  dispatch(
                    handleNewMessage(
                      `${
                        member.friendlyName || member.messagingIdentity
                      } ${i18n.t('has joined the channel.')}`,
                      'LOG'
                    )
                  );
                });
              }
            }
          );

          conversation.on(
            'participantLeft',
            (participant: TwilioParticipant) => {
              const currentConversation = getState().athleteChat.currentChannel;
              if (
                currentConversation &&
                currentConversation.sid === conversation.sid
              ) {
                participant.getUser().then((user: TwilioUser) => {
                  const memberName = user.friendlyName || user.identity;
                  dispatch(handleMemberLeft(user.identity));
                  dispatch(
                    handleNewMessage(
                      `${memberName} ${i18n.t('has left the channel.')}`,
                      'LOG'
                    )
                  );
                });
              }
            }
          );

          const conversationId = conversation.sid;
          const fetchForward = conversation.lastReadMessageIndex !== null;
          const messageIndex = conversation.lastReadMessageIndex
            ? Math.max(0, conversation.lastReadMessageIndex - 25)
            : undefined;

          if (conversation.status !== 'joined') {
            // Right now we are auto joining.. product still to decide desired behaviour
            conversation.join().then(() => {
              client
                .getSubscribedConversations()
                .then((conversationPaginator) => {
                  getAndConvertAllConversations(
                    conversationPaginator,
                    client
                  ).then((conversations) => {
                    // Split out directMessage channels from user channels
                    dispatch(
                      handleChannelListUpdated(
                        conversations.filter(
                          (c) => c.creationType !== 'direct'
                        ),
                        'USER'
                      )
                    );
                    dispatch(
                      handleChannelListUpdated(
                        conversations.filter(
                          (c) => c.creationType === 'direct'
                        ),
                        'DIRECT'
                      )
                    );

                    conversation
                      .getParticipantByIdentity(client.user.identity)
                      .then((participant: TwilioParticipant) => {
                        convertAConversationToChatChannel(
                          conversation,
                          client.user.identity
                        ).then((convertedChannel: ?ChatChannel) => {
                          if (!convertedChannel) {
                            return;
                          }
                          dispatch(handleChannelUpdated(convertedChannel)); // Can add updateReasons later if desired
                          dispatch(
                            handleChangedChannel(
                              convertedChannel,
                              participant?.attributes
                            )
                          );

                          // Get the participants but no need to await them
                          dispatch(fetchConversationParticipants(sid, client));

                          dispatch(handleFetchMessagesStatus('FETCHING'));
                          // Get messages back from last read position OR the most recent page of messages

                          getMessagesFromMessageIndex(
                            messageIndex, // As page size is 50: Get 25 behind where we last read and 25 forward
                            fetchForward ? 'forward' : 'backwards', // If we have some consumed messages fetch forward from there
                            conversation,
                            false, // If true would recursively get all the messages
                            50,
                            client.user.identity
                          )
                            .then((messageResult) => {
                              dispatch(
                                handleNewMessageBatch(
                                  conversationId,
                                  messageResult.messages,
                                  fetchForward ? 'APPEND' : 'PREPEND',
                                  messageResult.hasAnotherPage,
                                  messageResult.hasPageOtherDirection
                                )
                              );
                              dispatch(
                                handleFetchMessagesStatus('FETCH_COMPLETE')
                              );
                              resolve();
                            })
                            .catch((error) => {
                              dispatch(
                                handleFetchMessagesStatus('FETCH_ERROR')
                              );
                              dispatch(
                                handleNewMessage(
                                  `${i18n.t(
                                    'Failed to fetch messages'
                                  )} : ${error}`, // Will remove error once out of testing
                                  'LOG'
                                )
                              );
                              reject(
                                Error(`Failed to fetch messages: ${error}`)
                              );
                            });
                        });
                      });
                  });
                });
            });
          } else {
            conversation
              .getParticipantByIdentity(client.user.identity)
              .then((participant: TwilioParticipant) => {
                convertAConversationToChatChannel(
                  conversation,
                  client.user.identity
                ).then((convertedChannel: ?ChatChannel) => {
                  if (!convertedChannel) {
                    return;
                  }
                  dispatch(
                    handleChangedChannel(
                      convertedChannel,
                      participant?.attributes
                    )
                  );

                  // Get the participants but no need to await them
                  dispatch(fetchConversationParticipants(sid, client));

                  dispatch(handleFetchMessagesStatus('FETCHING'));
                  // Get messages back from last read position OR the most recent page of messages
                  getMessagesFromMessageIndex(
                    messageIndex, // As page size is 50: Get 25 behind where we last read and 25 forward
                    fetchForward ? 'forward' : 'backwards', // If we have some consumed messages fetch forward from there
                    conversation,
                    false, // If true would recursively get all the messages
                    50,
                    client.user.identity
                  )
                    .then((messageResult) => {
                      dispatch(
                        handleNewMessageBatch(
                          conversationId,
                          messageResult.messages,
                          fetchForward ? 'APPEND' : 'PREPEND',
                          messageResult.hasAnotherPage,
                          messageResult.hasPageOtherDirection
                        )
                      );
                      dispatch(handleFetchMessagesStatus('FETCH_COMPLETE'));
                      resolve();
                    })
                    .catch((error) => {
                      dispatch(handleFetchMessagesStatus('FETCH_ERROR'));
                      dispatch(
                        handleNewMessage(
                          `${i18n.t('Failed to fetch messages')} : ${error}`, // Will remove error once out of testing
                          'LOG'
                        )
                      );
                      reject(Error(`Failed to fetch messages: ${error}`));
                    });
                });
              });
          }
        })
        .catch((error) => {
          reject(Error(`Failed to switch channel: ${error}`));
        });
      resolve();
    });
  };
/* eslint-enable max-nested-callbacks */

// When our user requests to leave a conversation:
// If they are already joined:
// Stop listening for events from that conversation and leave it
// If is the conversation channel will unassign active conversation
export const leaveConversation =
  (
    sid: string,
    client: Client,
    assignActiveConversation: Function
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    return new Promise<void>((resolve: (value: any) => void, reject) => {
      client
        .getConversationBySid(sid)
        .then((conversation: TwilioConversation) => {
          if (conversation.status === 'joined') {
            removeConversationListeners(conversation);

            conversation.leave().then(() => {
              // NOTE: We could post a notification message from here that user joined or let clients detect new user.
              const currentConversation = getState().athleteChat.currentChannel;
              if (currentConversation && currentConversation.sid === sid) {
                // Left so will need user to switch to another channel.
                // NOTE: We may add a default channel to return to
                assignActiveConversation(null);
              }
              dispatch(handleLeftAChannel(sid));
            });
          }
        })
        .catch((error) => {
          dispatch(handleNewMessage(i18n.t('Failed to leave channel'), 'LOG'));
          reject(Error(`Failed to leave channel: ${error}`));
        });
      resolve();
    });
  };

export const openChannelImageUploadModal = (): Action => ({
  type: 'OPEN_CHANNEL_IMAGE_UPLOAD_MODAL',
});

export const closeChannelImageUploadModal = (): Action => ({
  type: 'CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL',
});
