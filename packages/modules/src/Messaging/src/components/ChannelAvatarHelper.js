// @flow
import { getOtherParticipant } from '../utils';
import ChatAvatar from './ChatAvatar';
import type { AvatarSize, AvatarDimensions } from './ChannelAvatar';
import type { ChatChannel } from '../types';

export const getChannelAvatar = (
  channel: ChatChannel,
  userIdentity: string,
  size: AvatarSize
) => {
  switch (channel.creationType) {
    case 'direct': {
      const participant = getOtherParticipant(channel, userIdentity);
      return (
        <ChatAvatar
          size={size}
          userIdentity={participant?.identity}
          friendlyName={participant?.friendlyName}
        />
      );
    }
    default:
      return (
        <ChatAvatar
          size={size}
          url={channel.avatarUrl}
          channelType={channel.creationType || undefined}
          friendlyName={channel.friendlyName}
        />
      );
  }
};

export const getAvatarDimensions = (size: AvatarSize): AvatarDimensions => {
  switch (size) {
    case 'SMALL':
      return {
        sizePixels: 20,
        statusDotSize: 8,
        statusDotBorder: 1,
        fallbackImageSize: 14,
      };
    case 'MEDIUM':
      return {
        sizePixels: 40,
        statusDotSize: 16,
        statusDotBorder: 2,
        fallbackImageSize: 22,
      };
    case 'LARGE':
      return {
        sizePixels: 80,
        statusDotSize: 32,
        statusDotBorder: 2.4,
        fallbackImageSize: 44,
      };
    default:
      return {
        sizePixels: 20,
        statusDotSize: 8,
        statusDotBorder: 1,
        fallbackImageSize: 14,
      };
  }
};
