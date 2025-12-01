// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import getAvatarDimensions from './ChannelAvatarDimensions';
import type { ChannelCreationType } from '../types';

export type AvatarSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type AvatarDimensions = {
  sizePixels: number,
  statusDotSize: number,
  statusDotBorder: number,
  fallbackImageSize: number,
};

export type Props = {
  channelFriendlyName: string,
  url: ?string,
  size?: AvatarSize,
  displayPointerCursor?: boolean,
  statusColor?: string,
  channelType?: ChannelCreationType,
};

const ChannelAvatar = ({
  channelFriendlyName,
  url,
  size,
  displayPointerCursor,
  statusColor,
  channelType,
}: Props) => {
  const { sizePixels, statusDotSize, statusDotBorder, fallbackImageSize } =
    getAvatarDimensions(size || ChannelAvatar.defaultProps.size);

  const style = {
    avatar: css`
      position: relative;
    `,

    channelAvatar: css`
      width: ${sizePixels}px;
      height: ${sizePixels}px;
      clip-path: circle(50%);
      cursor: ${displayPointerCursor ? 'pointer' : 'auto'};
    `,

    channelAvatarFallback: css`
      background-color: ${colors.cool_light_grey};
      background-image: ${channelType === 'direct'
        ? "url('../img/messaging/avatar.svg')"
        : "url('../img/messaging/group.svg')"};
      background-position: center;
      background-repeat: no-repeat;
      background-size: ${fallbackImageSize}px ${fallbackImageSize}px;
      cursor: ${displayPointerCursor ? 'pointer' : 'auto'};
      height: ${sizePixels}px;
      border-radius: 50%;
      position: relative;
      width: ${sizePixels}px;
    `,

    statusIndicator: css`
      background-color: ${statusColor};
      border-radius: 50%;
      border: ${statusDotBorder}px solid ${colors.white};
      bottom: 0;
      box-sizing: border-box;
      position: absolute;
      left: ${sizePixels - statusDotSize}px;
      height: ${statusDotSize}px;
      width: ${statusDotSize}px;
    `,
  };

  const statusIndicator = statusColor ? (
    <span css={style.statusIndicator} />
  ) : undefined;

  if (url) {
    return (
      <div css={style.avatar}>
        <img css={style.channelAvatar} src={url} alt={channelFriendlyName} />
        {statusIndicator}
      </div>
    );
  }

  return (
    <div css={style.avatar}>
      <div css={style.channelAvatarFallback} />
      {statusIndicator}
    </div>
  );
};

ChannelAvatar.defaultProps = {
  size: 'SMALL',
  displayPointerCursor: false,
  channelType: 'private',
};

export default ChannelAvatar;
