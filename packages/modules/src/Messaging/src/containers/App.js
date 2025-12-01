// @flow
import { connect } from 'react-redux';
import type { Client } from '@twilio/conversations';
import type { AthletesAndStaffSelection } from '@kitman/components/src/types';
import { openMessagingMembersModal } from '../components/MessagingMembersModal/actions';
import { openMessageInfoSidePanel } from '../components/MessageInfoSidePanel/actions';
import type { CreatableChannelTypes, TwilioConversation } from '../types';
import { AppTranslated as AppComponent } from '../components/App';

import {
  sendNewMessage,
  sendMedia,
  createConversationsClient,
  refreshConversationLists,
  switchConversation,
  leaveConversation,
  requestNextPageOfMessages,
  requestPreviousPageOfMessages,
  markConversationMessagesRead,
  createConversation,
  fetchConversationParticipants,
} from '../actions';

const mapStateToProps = (state) => ({
  userRole: state.athleteChat.userRole,
  messages: state.athleteChat.messages,
  userChannels: state.athleteChat.userChannels,
  directChannels: state.athleteChat.directChannels,
  currentChannel: state.athleteChat.currentChannel,
  currentChannelExtraData: state.athleteChat.currentChannelExtraData,
  generalStatus: state.athleteChat.generalStatus,
  inProgressMedia: state.athleteChat.inProgressMedia,
  searchableItemGroups: state.athleteChat.searchableItemGroups,
  activeSidePanel: state.messagingSidePanel.activeSidePanel,
});

let client: Client | null = null;
let activeChannel: TwilioConversation | null = null;

const assignChatClient = (chatClient: Client) => {
  client = chatClient;
};

const assignActiveChannel = (channel: TwilioConversation) => {
  activeChannel = channel;
};

const mapDispatchToProps = (dispatch) => ({
  sendNewMessage: (messageText, messageType) => {
    if (activeChannel) {
      dispatch(sendNewMessage(messageText, messageType, activeChannel));
    }
  },

  sendMedia: (files) => {
    if (activeChannel) {
      dispatch(sendMedia(files, activeChannel));
    }
  },

  createChatClient: (token) => {
    return dispatch(createConversationsClient(token, assignChatClient));
  },

  refreshChannelLists: (chatClient) => {
    return dispatch(refreshConversationLists(chatClient || client));
  },

  switchChannel: (sid) => {
    return dispatch(
      switchConversation(sid, client, activeChannel, assignActiveChannel)
    );
  },

  leaveChannel: (sid) => {
    return dispatch(leaveConversation(sid, client, assignActiveChannel));
  },

  requestNextPageOfMessages: () => {
    // Note: Returning so we could potentially wait for promise completion to hide a loading spinner
    if (activeChannel) {
      return dispatch(requestNextPageOfMessages(activeChannel));
    }
    return null;
  },

  requestPreviousPageOfMessages: () => {
    // Note: Returning so we could potentially wait for promise completion to hide a loading spinner
    if (activeChannel) {
      return dispatch(requestPreviousPageOfMessages(activeChannel));
    }
    return null;
  },

  markMessagesRead: (readToMessageIndex: number) => {
    if (activeChannel) {
      return dispatch(
        markConversationMessagesRead(activeChannel, readToMessageIndex)
      );
    }
    return null;
  },

  fetchChannelMembers: (sid: string) => {
    return dispatch(fetchConversationParticipants(sid, client));
  },

  showChannelMembersModal: (sid: string) => {
    dispatch(fetchConversationParticipants(sid, client)).then(
      dispatch(openMessagingMembersModal()),
      () => {
        // TODO: handle error
      }
    );
  },

  createChannel: (
    channelType: CreatableChannelTypes,
    channelName: string,
    channelDescription: string,
    channelMembers: AthletesAndStaffSelection,
    staffCanSend: boolean,
    athletesCanSend: boolean,
    channelSid: ?string,
    directMessageTargetFriendlyName: string
  ) => {
    return dispatch(
      createConversation(
        client,
        channelType,
        channelName,
        channelDescription,
        channelMembers,
        staffCanSend,
        athletesCanSend,
        channelSid,
        directMessageTargetFriendlyName
      )
    );
  },

  onViewMessageInfo: (messageIndex: number) => {
    dispatch(openMessageInfoSidePanel(messageIndex));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
