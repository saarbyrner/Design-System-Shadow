// @flow
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import type {
  AthletesAndStaffSelectorStaffMemberData,
  AthletesSelectorSquadData,
} from '@kitman/components/src/types';
import type {
  ChatMessage,
  ChatChannel,
  CurrentChannelExtraData,
  MessagingSidePanels,
  GeneralStatus,
  ChatContext,
  SearchableItemGroups,
  UserRole,
} from '../types';
import { ChatTranslated as Chat } from './Chat';

type Props = {
  chatContext: ChatContext,
  messages: Array<ChatMessage>,
  userRole: UserRole,
  userChannels: Array<ChatChannel>,
  directChannels: Array<ChatChannel>,
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  squads: Array<AthletesSelectorSquadData>,
  searchableItemGroups: SearchableItemGroups,
  inProgressMedia: Array<string>,
  currentChannel: ChatChannel,
  currentChannelExtraData: CurrentChannelExtraData,
  generalStatus: GeneralStatus,
  activeSidePanel: MessagingSidePanels,
  // Callbacks
  createChatClient: Function,
  sendNewMessage: Function,
  sendMedia: Function,
  switchChannel: Function,
  leaveChannel: Function,
  requestNextPageOfMessages: Function,
  requestPreviousPageOfMessages: Function,
  createChannel: Function,
  refreshChannelLists: Function,
  markMessagesRead: Function,
  showChannelMembersModal: Function,
  fetchChannelMembers: Function,
  onViewMessageInfo: Function,
};

const App = (props: Props) => {
  useEffect(() => {
    if (props.chatContext?.token) {
      const token = props.chatContext.token;
      props
        .createChatClient(token)
        .then((chatClient) => {
          props.refreshChannelLists(chatClient).then(() => {
            if (
              getIsLocalStorageAvailable() &&
              window.localStorage &&
              window.localStorage.getItem('lastUsedMessagingChannelSid')
            ) {
              props.switchChannel(
                window.localStorage.getItem('lastUsedMessagingChannelSid')
              );
            }
          });
        })
        .catch((error) => {
          props.sendNewMessage(`${i18n.t('Error')}: ${error.message}`, 'LOG');
        });
    } else {
      props.sendNewMessage(`${i18n.t('Error')}: No access token`, 'LOG');
    }
  }, []);

  return (
    <Chat
      messages={props.messages}
      userChannels={props.userChannels}
      directChannels={props.directChannels}
      staff={props.staff}
      squads={props.squads}
      searchableItemGroups={props.searchableItemGroups}
      inProgressMedia={props.inProgressMedia}
      currentChannel={props.currentChannel}
      currentChannelExtraData={props.currentChannelExtraData}
      generalStatus={props.generalStatus}
      userRole={props.userRole}
      activeSidePanel={props.activeSidePanel}
      // Callbacks
      onMessageSend={props.sendNewMessage}
      onSendMedia={props.sendMedia}
      onSwitchedChannel={props.switchChannel}
      onLeaveChannel={props.leaveChannel}
      onRequestNextPageOfMessages={props.requestNextPageOfMessages}
      onRequestPreviousPageOfMessages={props.requestPreviousPageOfMessages}
      onCreateChannel={props.createChannel}
      onRefreshChannelLists={props.refreshChannelLists}
      markMessagesRead={props.markMessagesRead}
      showChannelMembersModal={props.showChannelMembersModal}
      onFetchChannelMembers={props.fetchChannelMembers}
      onViewMessageInfo={props.onViewMessageInfo}
    />
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
