// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Client } from '@twilio/conversations';
import { createMediaDetails } from '@kitman/common/src/utils/mediaHelper';
import {
  type ChatMessage,
  type ChatChannel,
  type ChatAuthorDetails,
  type DirectMessageParticipant,
  type SearchableChannel,
  type SearchablePerson,
  type MessagingMember,
  type TwilioConversation,
  type TwilioParticipant,
  type TwilioUser,
  type TwilioMessage,
  type UpdateNotificationLevel,
  NOTIFICATION_LEVEL,
} from './types';

export const getMessageType = (
  message: TwilioMessage,
  username: string
): 'LOG' | 'ME' | 'THEM' => {
  const messageType = message.author === username ? 'ME' : 'THEM';
  return messageType;
};

export const getMessageDateAsMoment = (message: TwilioMessage): moment => {
  return moment(
    message.dateUpdated ? message.dateUpdated : message.dateCreated
  );
};

export const getMessageTimeString = (message: TwilioMessage): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatJustTime(getMessageDateAsMoment(message));
  }
  return getMessageDateAsMoment(message).format('h:mm a');
};

export const removeConversationListeners = (
  conversation: ?TwilioConversation
) => {
  if (conversation) {
    conversation
      .removeAllListeners('participantJoined')
      .removeAllListeners('participantLeft')
      .removeAllListeners('participantUpdated');
  }
};

export const getAuthorColourNumber = (authorIdentity: string) => {
  if (!authorIdentity) {
    return 1;
  }

  let hash = 0;
  let i = 0;
  for (i = 0; i < authorIdentity.length; i++) {
    const chr = authorIdentity.charCodeAt(i);
    hash = hash * 31 + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
    hash = Math.abs(hash);
  }
  return (hash % 10) + 1; // We have 10 colours setup
};

export const convertUserToChatAuthorDetails = (
  user: TwilioUser,
  messageAuthorFallback: string
): ChatAuthorDetails => {
  return {
    authorName: user.identity || messageAuthorFallback,
    friendlyName: user.friendlyName,
    colourNumber: getAuthorColourNumber(user.identity),
  };
};

// Accepts either Twilio Chat or Twilio Conversations objects
// Will be cleaned up on Twilio Chat removal
export const convertUserToMessagingMembers = (
  members: Array<TwilioParticipant>,
  users: Array<TwilioUser>,
  staff: Array<SearchablePerson>,
  athletes: Array<SearchablePerson>
): Array<MessagingMember> => {
  if (users) {
    return users.map((user) => {
      const sameMember = members.find((member) => {
        return member.identity === user.identity;
      });

      let memberKind = 'UNKNOWN';
      const foundInStaff = staff.find((staffMember) => {
        return staffMember.identifier === user.identity;
      });
      if (foundInStaff) {
        memberKind = 'STAFF';
      } else if (
        athletes.find((athlete) => {
          return athlete.identifier === user.identity;
        })
      ) {
        memberKind = 'ATHLETE';
      }

      return {
        messagingIdentity: user.identity,
        userId: user.identity.split('||')[1],
        friendlyName: user.friendlyName || undefined,
        memberKind,
        channelMemberSid: sameMember?.sid,
        channelRole: sameMember?.attributes?.role,
        lastReadMessageIndex: sameMember?.lastReadMessageIndex,
        lastReadTimestamp: sameMember?.lastReadTimestamp?.toISOString(),
      };
    });
  }
  return [];
};

const messageToChatMessageWithAuthor = (
  message: TwilioMessage,
  username: string,
  authorDetails: ChatAuthorDetails
): ChatMessage => {
  return {
    messageType: getMessageType(message, username),
    body: message.body,
    index: message.index,
    sid: message.sid,
    authorDetails,
    time: getMessageTimeString(message),
    date: getMessageDateAsMoment(message),
  };
};

const mediaMessageToChatMessageWithAuthor = async (
  message: TwilioMessage,
  username: string,
  authorDetails: ChatAuthorDetails
): Promise<ChatMessage> => {
  const url = await message.media.getContentTemporaryUrl();
  const mediaDetails = createMediaDetails(url, message.media);
  return {
    messageType: getMessageType(message, username),
    body: message.body,
    index: message.index,
    sid: message.sid,
    authorDetails,
    time: getMessageTimeString(message),
    date: getMessageDateAsMoment(message),
    media: message.media,
    mediaDetails,
  };
};

const convertMessageToChatMessage = async (
  message: TwilioMessage,
  username: string
): Promise<ChatMessage> => {
  // Resolve full chain of promises to the final converted message
  return new Promise((resolve) => {
    message
      .getParticipant()
      .then((participant: TwilioParticipant) => {
        participant.getUser().then((user: TwilioUser) => {
          const authorDetails = convertUserToChatAuthorDetails(
            user,
            message.author
          );
          if (message.type === 'media') {
            resolve(
              mediaMessageToChatMessageWithAuthor(
                message,
                username,
                authorDetails
              )
            );
          }
          resolve(
            messageToChatMessageWithAuthor(message, username, authorDetails)
          );
        });
      })
      .catch(() => {
        // Error is going to be due to not having a valid member (due to removal from channel)
        // So we won't be able to getUserDescriptor to get their friendlyName via the message member
        const authorDetails = {
          authorName: message.author,
          friendlyName: 'REMOVED_MEMBER', // We can't look this up now as need client reference. But can find this string later and get on demand.
          colourNumber: getAuthorColourNumber(message.author),
        };
        if (message.type === 'media') {
          resolve(
            mediaMessageToChatMessageWithAuthor(
              message,
              username,
              authorDetails
            )
          );
        }
        resolve(
          messageToChatMessageWithAuthor(message, username, authorDetails)
        );
      });
  });
};

export const convertMessagesToChatMessages = async (
  messages: Array<TwilioMessage>,
  username: string
): Promise<Array<ChatMessage>> => {
  // NOTE: reducer will check if message is from our current channel before adding to messages list
  // Each message will have async operations to gather all required data. We need to wait for all those to complete.
  return Promise.all(
    messages.map((message) => convertMessageToChatMessage(message, username))
  );
};

export const createShortName = (friendlyName: string): string => {
  return friendlyName.replace(/^#/, '').substring(0, 2).toUpperCase();
};

// Correct for bug where we perviously set a too high lastReadMessageIndex
export const correctReadMessageIndex = async (
  conversation: TwilioConversation
): Promise<number> => {
  try {
    const lastMessageIndex = conversation.lastMessage?.index || 0;
    const lastReadMessageIndex = conversation.lastReadMessageIndex;

    if (lastReadMessageIndex && lastMessageIndex < lastReadMessageIndex) {
      await conversation.updateLastReadMessageIndex(lastMessageIndex);
      return lastMessageIndex;
    }

    return lastReadMessageIndex ?? -1;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return 0;
};

export const countUnreadMessages = async (conversation: TwilioConversation) => {
  const lastReadMessageIndex = await correctReadMessageIndex(conversation);
  const lastMessageIndex = conversation.lastMessage?.index;
  const unreadMessagesCount =
    lastMessageIndex == null ? 0 : lastMessageIndex - lastReadMessageIndex;

  return {
    lastMessageIndex: lastMessageIndex || 0,
    lastReadMessageIndex,
    unreadMessagesCount,
  };
};

const partiallyConvertConversationToChatChannel = async (
  conversation: TwilioConversation
): Promise<ChatChannel> => {
  const { lastMessageIndex, lastReadMessageIndex, unreadMessagesCount } =
    await countUnreadMessages(conversation);

  const messagesCount = await conversation.getMessagesCount();

  let descriptionFromAttributes;
  let creationTypeFromAttributes;
  let directMessageParticipants;
  let avatarUrlFromAttributes;

  if (conversation.attributes) {
    descriptionFromAttributes = conversation.attributes.channelDescription;
    creationTypeFromAttributes = conversation.attributes.channelType;
    directMessageParticipants =
      conversation.attributes.directMessageParticipants;
    avatarUrlFromAttributes = conversation.attributes.channelAvatarUrl;
  }
  const conversion: ChatChannel = {
    sid: conversation.sid,
    friendlyName: conversation.friendlyName,
    isPublic: false,
    isMuted: conversation?.notificationLevel === NOTIFICATION_LEVEL.MUTED,
    status: conversation.status,
    lastConsumedMessageIndex: lastReadMessageIndex,
    lastMessageIndex,
    shortName:
      creationTypeFromAttributes !== 'direct'
        ? createShortName(conversation.friendlyName)
        : 'DM',
    unreadMessagesCount,
    description: descriptionFromAttributes,
    creationType: creationTypeFromAttributes,
    directMessageParticipants,
    uniqueName: conversation.uniqueName,
    dateCreated: moment(conversation.dateCreated),
    membersCount: await conversation.getParticipantsCount(),
    messagesCount,
    avatarUrl: avatarUrlFromAttributes,
    attributes: conversation.attributes,
    notificationLevel: conversation.notificationLevel,
  };
  return conversion;
};

export const convertAConversationToChatChannel = async (
  conversation: TwilioConversation,
  userIdentity: string
): Promise<?ChatChannel> => {
  try {
    const convertedChannel = await partiallyConvertConversationToChatChannel(
      conversation
    );
    return new Promise((resolve) => {
      if (
        convertedChannel.creationType === 'direct' &&
        convertedChannel.directMessageParticipants
      ) {
        // Apply convertedChannel friendlyName to the directMessageParticipants fallback
        // Will then attempt to fetch and apply latest friendly name for the other participant
        const directMessageParticipants =
          convertedChannel.directMessageParticipants;
        if (userIdentity === directMessageParticipants.creator.identity) {
          convertedChannel.friendlyName =
            directMessageParticipants.target.friendlyName;
        } else {
          convertedChannel.friendlyName =
            directMessageParticipants.creator.friendlyName;
        }
      }
      resolve(convertedChannel);
    });
  } catch (error) {
    return null; // Caller will need to filter away nulls
  }
};

export const convertConversationsToSortedChatChannels = async (
  conversations: Array<TwilioConversation>,
  client: Client
): Promise<Array<ChatChannel>> => {
  return Promise.all(
    conversations.map((c) =>
      convertAConversationToChatChannel(c, client.user.identity)
    )
  ).then((converted: Array<?ChatChannel>) => {
    // $FlowIgnore filter removes nulls
    const channels: Array<ChatChannel> = converted.filter(
      (channel) => channel != null
    );

    return channels.sort((a: ChatChannel, b: ChatChannel) => {
      return a.friendlyName.localeCompare(b.friendlyName); // Names might have non-ASCII characters,
    });
  });
};

export const convertChatChannelsToSearchableChannels = (
  channels: Array<ChatChannel>
): Array<SearchableChannel> => {
  return channels
    .map((channel) => ({
      display_name: channel.friendlyName,
      split_searchable_values: channel.friendlyName.toLowerCase().split(' '),
      result_type: 'channel',
      identifier: channel.sid,
      avatar_url: channel.avatarUrl,
    }))
    .sort((a: SearchableChannel, b: SearchableChannel) => {
      return a.display_name.localeCompare(b.display_name); // Names might have non-ASCII characters,
    });
};

export const getChatIdentityForUser = (
  orgId: string,
  userId: string
): string => {
  return `${orgId}||${userId}`;
};

export const getDirectMessageChannelUniqueName = (
  userIdentityA: string,
  userIdentityB: string
): string => {
  // The identities or both participants make up the unique channel name
  // Sort the identities for the unique channel name so won't ever create a second channel between same two participants
  const inOrderIdentities = [userIdentityA, userIdentityB].sort();
  return `${inOrderIdentities[0]}__${inOrderIdentities[1]}`;
};

export const getOtherParticipant = (
  channel: ChatChannel,
  userIdentity: string
): ?DirectMessageParticipant => {
  if (channel.directMessageParticipants) {
    // $FlowFixMe participants will be present
    return userIdentity === channel.directMessageParticipants.creator.identity
      ? channel.directMessageParticipants.target
      : channel.directMessageParticipants.creator;
  }
  return undefined;
};

export const updateNotificationLevel = async ({
  client,
  sid,
  level,
  onSuccess,
  onError,
}: UpdateNotificationLevel) => {
  try {
    const conversation = await client.getConversationBySid(sid);

    if (conversation) {
      await conversation.setUserNotificationLevel(level);
      onSuccess?.();
    }
  } catch (error) {
    console.error(error);
    onError?.();
  }
};
