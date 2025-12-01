// @flow
import type {
  TwilioConversation,
  TwilioMessage,
  TwilioPaginator,
  ChatMessage,
  ChatChannel,
} from './types';
import {
  convertMessagesToChatMessages,
  convertConversationsToSortedChatChannels,
} from './utils';

export type MessagesResult = {
  messages: Array<ChatMessage>,
  hasAnotherPage: boolean,
  hasPageOtherDirection: boolean,
};

// Pagination Helper
export const processNextPage = async (
  page: TwilioPaginator<TwilioMessage>,
  result: MessagesResult,
  username: string,
  recursive: boolean
) => {
  if (page.items) {
    await convertMessagesToChatMessages(page.items, username).then(
      (chatMessages) => {
        result.messages.push(...chatMessages);
      }
    );
  }

  // eslint-disable-next-line no-param-reassign
  result.hasAnotherPage = page.hasNextPage;

  if (page.hasNextPage) {
    if (recursive) {
      await page.nextPage().then(async (nextPage) => {
        await processNextPage(nextPage, result, username, recursive);
      });
    }
  }
};

// Pagination Helper
export const processPreviousPage = async (
  page: TwilioPaginator<TwilioMessage>,
  result: MessagesResult,
  username: string,
  recursive: boolean
) => {
  if (page.items) {
    await convertMessagesToChatMessages(page.items, username).then(
      (chatMessages) => {
        result.messages.unshift(...chatMessages);
      }
    );
  }

  // eslint-disable-next-line no-param-reassign
  result.hasAnotherPage = page.hasPrevPage;

  if (page.hasPrevPage) {
    if (recursive) {
      await page.prevPage().then(async (prevPage) => {
        await processPreviousPage(prevPage, result, username, recursive);
      });
    }
  }
};

// Message Pagination Helper
export const getMessagesFromMessageIndex = async (
  messageIndex?: number,
  direction: 'forward' | 'backwards',
  activeChannel: TwilioConversation,
  retrieveAll: boolean,
  pageSize: number,
  username: string // Needed for message conversion
): Promise<MessagesResult> => {
  // Initial result is empty of messages
  // The 'Process page' functions bellow will add messages to it ( recursively if desired )
  const result: MessagesResult = {
    messages: [],
    hasAnotherPage: false,
    hasPageOtherDirection: false,
  };

  const page = await activeChannel.getMessages(
    pageSize,
    messageIndex,
    direction
  );

  // NOTE: Using async & await pattern as I feel The recursive getting of messages would be harder to implement with a promise.then chain
  if (page && page.items) {
    if (direction === 'forward') {
      result.hasPageOtherDirection = page.hasPrevPage;
      await processNextPage(page, result, username, retrieveAll); // retrieveAll true = Can have a recursive call
    } else {
      result.hasPageOtherDirection = page.hasNextPage;
      await processPreviousPage(page, result, username, retrieveAll); // retrieveAll true = Can have a recursive call
    }
  }

  return result;
};

export const processNextConversationPage = async (
  page: TwilioPaginator<TwilioConversation>,
  result: Array<TwilioConversation>
) => {
  if (page.items) {
    result.push(...page.items);
  }

  if (page.hasNextPage) {
    await page.nextPage().then(async (nextPage) => {
      await processNextConversationPage(nextPage, result);
    });
  }
};

export const getAndConvertAllConversations = async (
  page: TwilioPaginator<TwilioConversation>,
  client: Client
): Promise<Array<ChatChannel>> => {
  const conversations: Array<TwilioConversation> = [];
  await processNextConversationPage(page, conversations);
  return convertConversationsToSortedChatChannels(conversations, client);
};
