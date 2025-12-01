// @flow
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { IconButton } from '@kitman/components';
import { getChannelAvatar } from './ChannelAvatarHelper';
import type { ChatChannel } from '../types';

type Props = {
  title?: string,
  channels: Array<ChatChannel>,
  userIdentity: string,
  onSwitchedChannel: Function,
  currentChannel: ?ChatChannel,
  showUnreadCount: boolean,
  showChannelCount: boolean,
  bigIcons: boolean,
  hideIfZeroChannels: boolean,
  channelsFilter?: Function,
  plusButtonAction?: Function,
};

const ChatChannelSelector = (props: Props) => {
  const [filteredChannels, setFilteredChannels] = useState([]);

  useEffect(() => {
    if (props.channels) {
      if (props.channelsFilter) {
        setFilteredChannels(props.channels.filter(props.channelsFilter));
      } else {
        setFilteredChannels(props.channels);
      }
    } else {
      setFilteredChannels([]);
    }
  }, [props.channels]); // Only run when channels change. channelsFilter function not expected to change

  const handleChannelSelected = (sid: string) => {
    if (sid !== props.currentChannel?.sid) {
      const selectedChannel = filteredChannels.find(
        (channel) => channel.sid === sid
      );
      if (selectedChannel) {
        props.onSwitchedChannel(sid);
      }
    }
  };

  const displayChannels = () => {
    return filteredChannels.map((channel) => {
      return (
        <div
          key={channel.sid}
          className={classNames('chatChannelSelector__channel', {
            'chatChannelSelector__channel--active':
              channel.sid === props.currentChannel?.sid,
            'chatChannelSelector__channel--big': props.bigIcons,
          })}
          onClick={() => handleChannelSelected(channel.sid)}
        >
          {getChannelAvatar(
            channel,
            props.userIdentity,
            props.bigIcons ? 'MEDIUM' : 'SMALL'
          )}
          <span
            className={classNames('chatChannelSelector__channelName', {
              'chatChannelSelector__channelName--direct':
                channel.creationType === 'direct',
            })}
          >
            {channel.friendlyName}
          </span>
          {props.showUnreadCount && channel.unreadMessagesCount > 0 && (
            <span className="chatChannelSelector__unreadMessagesIcon">
              {channel.unreadMessagesCount}
            </span>
          )}
        </div>
      );
    });
  };

  // Don't render the component if nothing to show
  if (props.hideIfZeroChannels && filteredChannels.length < 1) {
    return null;
  }

  return (
    <div className="chatChannelSelector">
      <div className="chatChannelSelector__header">
        {props.title && (
          <div className="chatChannelSelector__title">{props.title}</div>
        )}
        {props.showChannelCount && (
          <div className="chatChannelSelector__count">
            {filteredChannels.length}
          </div>
        )}
        {props.plusButtonAction && (
          <div className="chatChannelSelector__plus">
            <IconButton
              icon="icon-add"
              isSmall
              isBorderless
              onClick={props.plusButtonAction}
            />
          </div>
        )}
      </div>

      <div className="chatChannelSelector__channelList">
        {displayChannels()}
      </div>
    </div>
  );
};

ChatChannelSelector.defaultProps = {
  showUnreadCount: false,
  showChannelCount: false,
  bigIcons: false,
  hideIfZeroChannels: false,
};

export default ChatChannelSelector;
