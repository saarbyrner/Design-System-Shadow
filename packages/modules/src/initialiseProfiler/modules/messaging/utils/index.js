// @flow
import i18n from '@kitman/common/src/utils/i18n';
import getInitialData from '@kitman/services/src/services/messaging/getInitialData';
import {
  countUnreadMessages,
  getMessageTimeString,
} from '@kitman/modules/src/Messaging/src/utils';
import { getAndConvertAllConversations } from '@kitman/modules/src/Messaging/src/paginationHelper';
import {
  NOTIFICATION_LEVEL,
  type TwilioConversation,
} from '@kitman/modules/src/Messaging/src/types';
import type { Client, Message } from '@twilio/conversations';
import { TOAST_TYPE } from '@kitman/components/src/Toast/types';

export const handleTokenRefresh = async (client: Client) => {
  try {
    const data = await getInitialData();
    const { token } = JSON.parse(data.context);
    await client.updateToken(token);
  } catch (error) {
    console.error(error);
  }
};

export const populateInitialUnreadMessages = async (
  client: Client,
  callback: ({ sid: string, count: number }) => void
) => {
  try {
    const conversationPaginator = await client.getSubscribedConversations();
    const conversations = await getAndConvertAllConversations(
      conversationPaginator,
      client
    );

    conversations.forEach(({ sid, unreadMessagesCount }) => {
      callback({
        sid,
        count: unreadMessagesCount,
      });
    });
  } catch (error) {
    // TODO: Handle error in a more meaningful way
    console.error(error);
  }
};

export const updateUnreadMessages = async (
  conversation: TwilioConversation,
  callback: (args: { sid: string, count: number }) => void
) => {
  try {
    const { unreadMessagesCount } = await countUnreadMessages(conversation);
    callback({ sid: conversation.sid, count: unreadMessagesCount });
  } catch (error) {
    console.error(error);
  }
};

export const getAuthorName = async (message: Message) => {
  try {
    const participant = await message.getParticipant();
    const user = await participant.getUser();
    return user.friendlyName;
  } catch {
    return message.author;
  }
};

export const getToastMessageData = async (message: Message) => {
  const { conversation, attachedMedia, body } = message;
  const { attributes, friendlyName: channel } = conversation ?? {};

  const authorName = await getAuthorName(message);
  const description =
    body ||
    (attachedMedia?.length ? i18n.t('Received media attachment...') : '');
  const isDirectMessage = attributes?.channelType === 'direct';
  const channelInfo = isDirectMessage ? '' : ` · ${channel}`;

  return {
    title: `${authorName}${channelInfo}`,
    description,
    metadata: {
      time: getMessageTimeString(message),
      channelSid: conversation?.sid,
    },
    type: TOAST_TYPE.MESSAGE,
  };
};

export const handleNotifications = async (
  message: Message,
  callback: (data: any) => void
) => {
  try {
    const toastData = await getToastMessageData(message);
    callback(toastData);
  } catch (error) {
    console.error(error);
  }
};

export const isNotificationEnabled = (
  message: Message,
  currentUser: string,
  route: string
) => {
  const { conversation, author } = message;

  if (!conversation || !author) return false;

  return (
    author !== currentUser &&
    !route.startsWith('/messaging') &&
    conversation?.notificationLevel !== NOTIFICATION_LEVEL.MUTED
  );
};
