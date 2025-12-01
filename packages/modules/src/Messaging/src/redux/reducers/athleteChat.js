// @flow
import moment from 'moment';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import {
  checkExpiration,
  getExpirationFromUrl,
} from '@kitman/common/src/utils/mediaHelper';
import type { Action as MessagingMembersModalActions } from '../../components/MessagingMembersModal/types';
import type { Action as MessageInfoSidePanelActions } from '../../components/MessageInfoSidePanel/types';
import type { athleteChatState, Action, ChatMessage } from '../../types';
import { convertChatChannelsToSearchableChannels } from '../../utils';

export default (
  state: athleteChatState = {},
  action: Action | MessagingMembersModalActions | MessageInfoSidePanelActions
): athleteChatState => {
  switch (action.type) {
    case 'HANDLE_GENERAL_STATUS_CHANGED': {
      return {
        ...state,
        generalStatus: action.payload.status,
      };
    }
    case 'HANDLE_USERNAME_RECEIVED': {
      return {
        ...state,
        username: action.payload.username,
      };
    }
    case 'HANDLE_NEW_MESSAGE': {
      if (
        (state.currentChannel &&
          action.payload.channelId === state.currentChannel.sid) ||
        action.payload.message.messageType === 'LOG'
      ) {
        const newMessages = [...state.messages];
        const payloadMessage = action.payload.message;
        const newMessage =
          payloadMessage.messageType === 'LOG'
            ? {
                ...payloadMessage,
                index: newMessages.length,
              }
            : payloadMessage;
        newMessages.push(newMessage);
        return {
          ...state,
          messages: newMessages,
        };
      }
      return state;
    }
    case 'HANDLE_NEW_MESSAGE_BATCH': {
      // Currently we only get messages for the current channel
      // So can update the currentChannel state
      if (
        state.currentChannel &&
        state.currentChannel.sid === action.payload.channelId
      ) {
        const currentMessagesCount = state.messages.length;
        const newMessages =
          action.payload.listAction === 'APPEND'
            ? [...state.messages, ...action.payload.messages]
            : [...action.payload.messages, ...state.messages];

        const dataClone = { ...state.currentChannelExtraData };

        if (action.payload.listAction === 'APPEND') {
          dataClone.hasUnretrievedNewerMessages = action.payload.hasAnotherPage;
          // eslint-disable-next-line max-depth
          if (currentMessagesCount === 0) {
            dataClone.hasUnretrievedOlderMessages =
              action.payload.hasPageOtherDirection;
          }
        }

        if (action.payload.listAction === 'PREPEND') {
          dataClone.hasUnretrievedOlderMessages = action.payload.hasAnotherPage;
          // eslint-disable-next-line max-depth
          if (currentMessagesCount === 0) {
            dataClone.hasUnretrievedNewerMessages =
              action.payload.hasPageOtherDirection;
          }
        }

        return {
          ...state,
          messages: newMessages,
          currentChannelExtraData: dataClone,
        };
      }
      return state;
    }
    case 'HANDLE_SENDING_MEDIA': {
      const media = [...state.inProgressMedia];
      media.push(action.payload.filename);
      return {
        ...state,
        inProgressMedia: media,
      };
    }
    case 'HANDLE_MEDIA_SENT': {
      return {
        ...state,
        inProgressMedia: state.inProgressMedia.filter(
          (filename) => filename !== action.payload.filename
        ),
      };
    }
    case 'HANDLE_MEDIA_REJECTED': {
      // TODO: for now this will just results in the inProgress toast being removed
      // Will want to create a new state param of a list of errors to display as toasts
      // In this case toast will need to detail why a rejection happened
      return {
        ...state,
        inProgressMedia: state.inProgressMedia.filter(
          (filename) => filename !== action.payload.filename
        ),
      };
    }
    case 'HANDLE_MESSAGE_REJECTED': {
      // No state modification yet
      // TODO: Will want to create a new state param of a list of errors to display as toasts
      // In this case toast will need to detail why a rejection happened
      return state;
    }
    case 'HANDLE_REFRESH_MEDIA_MESSAGE': {
      if (
        state.currentChannel &&
        state.currentChannel.sid === action.payload.channelId
      ) {
        const currentMessages: Array<ChatMessage> = [...state.messages];
        const index = currentMessages.findIndex(
          (message) => message.sid === action.payload.messageSid
        );
        if (index !== -1) {
          const messageToUpdate: ChatMessage = currentMessages[index];
          const expiry = getExpirationFromUrl(action.payload.url);
          const hasExpired = checkExpiration(expiry);
          const selectedMessageMediaChangedTime =
            state.selectedMessageIndex === messageToUpdate.index
              ? moment().toISOString()
              : state.selectedMessageMediaChangedTime;

          // eslint-disable-next-line max-depth
          if (messageToUpdate.mediaDetails) {
            messageToUpdate.mediaDetails.hasExpired = hasExpired;
            messageToUpdate.mediaDetails.expiration = expiry;
            messageToUpdate.mediaDetails.url = action.payload.url;
          }

          return {
            ...state,
            selectedMessageMediaChangedTime,
            messages: currentMessages,
          };
        }
      }
      return state;
    }
    case 'HANDLE_UPDATE_MEDIA_EXPIRES': {
      if (state.currentChannel) {
        let someMediaExpired = false;
        const currentMessages: Array<ChatMessage> = [...state.messages];
        let selectedMessageMediaChangedTime =
          state.selectedMessageMediaChangedTime;
        currentMessages.forEach((message) => {
          if (message.mediaDetails && !message.mediaDetails.hasExpired) {
            const updatedHasExpired = checkExpiration(
              message.mediaDetails.expiration
            );
            /* eslint-disable no-param-reassign */
            // $FlowFixMe
            message.mediaDetails.hasExpired = updatedHasExpired;

            selectedMessageMediaChangedTime =
              state.selectedMessageIndex === message.index
                ? moment().toISOString()
                : state.selectedMessageMediaChangedTime;

            /* eslint-enable */
            if (!someMediaExpired) {
              someMediaExpired = updatedHasExpired;
            }
          }
        });
        if (someMediaExpired) {
          return {
            ...state,
            selectedMessageMediaChangedTime,
            messages: currentMessages,
          };
        }
      }
      return state;
    }
    case 'HANDLE_CHANNEL_LIST_UPDATED': {
      const searchableChannels = convertChatChannelsToSearchableChannels(
        action.payload.channels
      );
      const searchableItemGroupsShallowCopy = { ...state.searchableItemGroups };
      switch (action.payload.channelType) {
        case 'USER':
          searchableItemGroupsShallowCopy.userChannels = searchableChannels;
          return {
            ...state,
            userChannels: action.payload.channels,
            searchableItemGroups: searchableItemGroupsShallowCopy,
          };
        case 'DIRECT':
          searchableItemGroupsShallowCopy.directChannels = searchableChannels;
          return {
            ...state,
            directChannels: action.payload.channels,
            searchableItemGroups: searchableItemGroupsShallowCopy,
          };
        default:
          return state;
      }
    }
    case 'HANDLE_CHANNEL_UPDATED': {
      let stateCopy = { ...state };
      if (action.payload.channel.sid === state.currentChannel?.sid) {
        stateCopy = {
          ...stateCopy,
          currentChannel: action.payload.channel,
        };
      }
      const sid = action.payload.channel.sid;

      // Update userChannels if needed
      const userChannelsIndex = state.userChannels.findIndex(
        (ch) => ch.sid === sid
      );
      if (userChannelsIndex !== -1) {
        const refreshedChannels = [...state.userChannels];
        refreshedChannels[userChannelsIndex] = action.payload.channel;
        stateCopy = {
          ...stateCopy,
          userChannels: refreshedChannels,
        };
      }

      // Update directChannels if needed
      const directChannelsIndex = state.directChannels.findIndex(
        (ch) => ch.sid === sid
      );
      if (directChannelsIndex !== -1) {
        const refreshedChannels = [...state.directChannels];
        refreshedChannels[directChannelsIndex] = action.payload.channel;
        stateCopy = {
          ...stateCopy,
          directChannels: refreshedChannels,
        };
      }

      return stateCopy; // Expected that one or more of the above if statement will be true
    }

    case 'HANDLE_CHANGED_CHANNEL': {
      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem(
          'lastUsedMessagingChannelSid',
          action.payload.channel.sid
        );
      }

      const memberRoleName = action.payload.memberAttributes?.role;

      return {
        ...state,
        messages: [], // NOTE: Clearing the messages and refetching for now. Could consider cache after MVP
        currentChannel: action.payload.channel,
        currentChannelExtraData: {
          ...state.currentChannelExtraData,
          hasUnretrievedNewerMessages: false, // Until the messages are retrieved we won't know so false is safest
          hasUnretrievedOlderMessages: false, // Until the messages are retrieved we won't know so false is safest
          fetchMessagesStatus: 'NOT_REQUESTED_YET',
          memberRole: memberRoleName,
          members: [],
        },
      };
    }
    case 'HANDLE_LEFT_A_CHANNEL': {
      return {
        ...state,
        messages: [], // NOTE: Clearing message until user selects another channel
        currentChannel: null,
        currentChannelExtraData: {
          ...state.currentChannelExtraData,
          hasUnretrievedNewerMessages: false, // Until the messages are retrieved we won't know so false is safest
          hasUnretrievedOlderMessages: false, // Until the messages are retrieved we won't know so false is safest
          fetchMessagesStatus: 'NOT_REQUESTED_YET',
          memberRole: undefined,
          members: [],
        },
      };
    }
    case 'HANDLE_FETCH_MESSAGES_STATUS': {
      // For when the status of fetching messages changes
      if (state.currentChannelExtraData) {
        const dataClone = { ...state.currentChannelExtraData };
        dataClone.fetchMessagesStatus = action.payload.requestStatus;
        return {
          ...state,
          currentChannelExtraData: dataClone,
        };
      }
      return state;
    }
    case 'HANDLE_USER_DETAILS_RECEIVED': {
      if (state.username === action.payload.username) {
        return {
          ...state,
          userFriendlyName:
            action.payload.friendlyName || state.userFriendlyName, // Maintain current value if not present
        };
      }
      return state;
    }
    case 'HANDLE_CURRENT_CHANNEL_MEMBER_UPDATED': {
      const members = state.currentChannelExtraData?.members;
      if (members) {
        const updatedMembers = members.map((member) =>
          member.messagingIdentity === action.payload.memberIdentity
            ? {
                ...member,
                channelRole: action.payload.memberAttributes?.role,
                lastReadMessageIndex: action.payload.lastReadMessageIndex,
                lastReadTimestamp: action.payload.lastReadTimestamp,
              }
            : member
        );
        const memberRoleName = action.payload.memberAttributes?.role;
        if (state.username === action.payload.memberIdentity) {
          return {
            ...state,
            currentChannelExtraData: {
              ...state.currentChannelExtraData,
              memberRole: memberRoleName,
              members: updatedMembers,
            },
          };
        }
        return {
          ...state,
          currentChannelExtraData: {
            ...state.currentChannelExtraData,
            members: updatedMembers,
          },
        };
      }
      return state;
    }
    case 'HANDLE_CURRENT_CHANNEL_MEMBER_LEFT': {
      const members = state.currentChannelExtraData?.members;
      if (members) {
        const updatedMembers = members.filter(
          (member) => member.messagingIdentity !== action.payload.memberIdentity
        );
        return {
          ...state,
          currentChannelExtraData: {
            ...state.currentChannelExtraData,
            members: updatedMembers,
          },
        };
      }
      return state;
    }
    case 'HANDLE_CURRENT_CHANNEL_MEMBER_JOINED': {
      const members = state.currentChannelExtraData?.members;
      const updatedMembers = members
        ? [...members, action.payload.member]
        : [action.payload.member];

      return {
        ...state,
        currentChannelExtraData: {
          ...state.currentChannelExtraData,
          members: updatedMembers,
        },
      };
    }
    case 'OPEN_MESSAGING_MEMBERS_MODAL': {
      return {
        ...state,
        channelMembersModal: {
          ...state.channelMembersModal,
          isOpen: true,
        },
      };
    }
    case 'CLOSE_MESSAGING_MEMBERS_MODAL': {
      return {
        ...state,
        channelMembersModal: {
          ...state.channelMembersModal,
          isOpen: false,
        },
      };
    }
    case 'OPEN_CHANNEL_IMAGE_UPLOAD_MODAL': {
      return {
        ...state,
        imageUploadModal: {
          ...state.imageUploadModal,
          isOpen: true,
        },
      };
    }
    case 'CLOSE_CHANNEL_IMAGE_UPLOAD_MODAL': {
      return {
        ...state,
        imageUploadModal: {
          ...state.imageUploadModal,
          isOpen: false,
        },
      };
    }
    case 'OPEN_MESSAGE_INFO_SIDE_PANEL': {
      return {
        ...state,
        selectedMessageIndex: action.payload.messageIndex,
      };
    }
    case 'UPDATE_CURRENT_CHANNEL_MEMBERS': {
      return {
        ...state,
        currentChannelExtraData: {
          ...state.currentChannelExtraData,
          members: action.payload.members ? [...action.payload.members] : [],
        },
      };
    }

    default:
      return state;
  }
};
