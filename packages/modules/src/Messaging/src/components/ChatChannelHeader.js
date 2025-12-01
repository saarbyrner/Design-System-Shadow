// @flow
import { withNamespaces } from 'react-i18next';
import { IconButton, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getChannelAvatar } from './ChannelAvatarHelper';
import {
  type SearchableItemGroups,
  type UserRole,
  type ChatChannel,
  type CurrentChannelExtraData,
  CHANNEL_CREATION,
} from '../types';
import { ChatChannelSearchTranslated as ChannelSearch } from './ChatChannelSearch';

type Props = {
  channel: ChatChannel,
  currentChannelExtraData: CurrentChannelExtraData,
  showSearch: boolean,
  searchableItemGroups: SearchableItemGroups,
  directChannels: Array<ChatChannel>,
  userRole: UserRole,
  // Callbacks
  onSwitchedChannel: Function,
  onLeaveChannel: Function,
  showChannelMembersModal: Function,
  showChannelMembersSidePanel: Function,
  showChannelSettingsSidePanel: Function,
  openChannelsListCallback: Function,
  onDirectMessageUser: Function,
};

const ChatChannelHeader = (props: I18nProps<Props>) => {
  const getChannelDetails = () => {
    return (
      <div className="chatChannelHeader__channelDetails">
        <div className="chatChannelHeader__channelName">
          {props.channel.friendlyName}
        </div>
        {props.channel.description && (
          <div className="chatChannelHeader__channelDescription">
            {props.channel.description}
          </div>
        )}
      </div>
    );
  };

  const getMenu = () => {
    const isDisabled = !props.channel;

    const userIsAdmin =
      props.currentChannelExtraData?.memberRole === 'channel admin' ||
      props.userRole.permissions.canAdministrateChannel;

    const isDirectChannelEnabled =
      window.getFlag('cp-messaging-notifications') &&
      window.getFlag('single-page-application');

    const enableChannelSettings =
      props.channel &&
      (props.channel.creationType !== CHANNEL_CREATION.DIRECT ||
        isDirectChannelEnabled);

    const channelSettings = {
      description: props.t('Channel Settings'),
      isDisabled: !enableChannelSettings,
      onClick: () => props.showChannelSettingsSidePanel(),
    };

    const manageChannelMembers = {
      description: props.t('Manage Members'),
      isDisabled:
        !props.channel ||
        props.channel.creationType === CHANNEL_CREATION.DIRECT,
      onClick: () => props.showChannelMembersSidePanel(),
    };

    const viewChannelMembers = {
      description: props.t('View Members'),
      isDisabled: !props.channel,
      onClick: () => props.showChannelMembersModal(props.channel.sid),
    };

    const leaveChannel = {
      description: props.t('Leave Channel'),
      isDisabled: true, // Once ChatAPI supports it will be !props.channel || props.channel.status !== 'joined'
      onClick: () => props.onLeaveChannel(props.channel.sid),
    };

    const menuItems = userIsAdmin
      ? [
          channelSettings,
          viewChannelMembers,
          manageChannelMembers,
          leaveChannel,
        ]
      : [channelSettings, viewChannelMembers, leaveChannel];

    return (
      <TooltipMenu
        placement="bottom-end"
        disabled={isDisabled}
        offset={[6, 2]}
        menuItems={menuItems}
        tooltipTriggerElement={
          <button
            type="button"
            className={`chatChannelHeader__menuButton ${
              isDisabled ? 'chatChannelHeader__menuButton--disabled' : ''
            }`}
          >
            <i className="icon-menu" />
          </button>
        }
        customClassnames={['chatContainer__tooltipMenu']}
        kitmanDesignSystem
      />
    );
  };

  const getMode = () => {
    if (props.showSearch) {
      return (
        <div className="chatChannelHeader chatChannelHeader">
          <div className="chatChannelHeader__showChannelsListButton">
            <IconButton
              icon="icon-messaging"
              onClick={() => {
                props.openChannelsListCallback();
              }}
              isSmall
            />
          </div>
          <ChannelSearch
            maxDisplayableResults={10}
            searchableItemGroups={props.searchableItemGroups}
            directChannels={props.directChannels}
            userRole={props.userRole}
            onSwitchedChannel={props.onSwitchedChannel}
            onDirectMessageUser={props.onDirectMessageUser}
          />
        </div>
      );
    }
    return (
      <div className="chatChannelHeader">
        <div className="chatChannelHeader__showChannelsListButton">
          <IconButton
            icon="icon-messaging"
            onClick={() => {
              props.openChannelsListCallback();
            }}
            isSmall
          />
        </div>
        {props.channel &&
          props.userRole &&
          getChannelAvatar(props.channel, props.userRole.identity, 'MEDIUM')}
        {props.channel && getChannelDetails()}
        {props.channel && getMenu()}
      </div>
    );
  };

  return getMode();
};

export const ChatChannelHeaderTranslated = withNamespaces()(ChatChannelHeader);
export default ChatChannelHeader;
