// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { SearchablePerson, ChannelCreationType } from '../types';
import ChannelAvatar from './ChannelAvatar';
import type { AvatarSize } from './ChannelAvatar';

type Props = {
  userIdentity?: ?string, // Identity of the user you want to display the avatar image for
  friendlyName: ?string,
  channelType?: ChannelCreationType,
  url?: string,
  size?: AvatarSize,
};

const ChatAvatar = (props: Props) => {
  const staff: Array<SearchablePerson> =
    useSelector((state) => state.athleteChat.searchableItemGroups.staff) || [];

  const athletes: Array<SearchablePerson> =
    useSelector((state) => state.athleteChat.searchableItemGroups.athletes) ||
    [];

  const getAvatarImageUrl = (): ?string => {
    if (props.url) {
      return props.url;
    }
    if (props.userIdentity) {
      const foundAthlete = athletes.find(
        (athlete) => athlete.identifier === props.userIdentity
      );
      if (foundAthlete) {
        return foundAthlete.avatar_url;
      }

      const foundStaffMember = staff.find(
        (staffMember) => staffMember.identifier === props.userIdentity
      );
      if (foundStaffMember) {
        return foundStaffMember.avatar_url;
      }
    }
    return undefined;
  };

  const avatarUrl = useMemo(
    () => getAvatarImageUrl(),
    [props.userIdentity, props.url, props.channelType]
  );

  return (
    <ChannelAvatar
      channelFriendlyName={props.friendlyName || ''}
      size={props.size}
      url={avatarUrl}
      channelType={props.channelType}
    />
  );
};

ChatAvatar.defaultProps = {
  size: 'SMALL',
  channelType: 'direct',
};

export default ChatAvatar;
