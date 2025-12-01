// @flow
import type { AvatarSize, AvatarDimensions } from './ChannelAvatar';

const getAvatarDimensions = (size: AvatarSize): AvatarDimensions => {
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

export default getAvatarDimensions;
