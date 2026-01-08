// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { SerializedStyles } from '@emotion/react';
import type { AthleteAvailabilities } from '@kitman/common/src/types/Event';
import getAthleteAvailabilityStyles from '@kitman/common/src/utils/getAthleteAvailabilityStyles';

export type GetStyleParams = $Exact<{
  size?: 'EXTRA_SMALL' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE',
  statusDotMargin?: number,
  statusColor?: string,
  displayPointerCursor?: boolean,
  availability?: AthleteAvailabilities,
}>;

export const getStyle = ({
  size,
  statusDotMargin,
  statusColor,
  displayPointerCursor,
  availability,
}: GetStyleParams): { [string]: SerializedStyles } => {
  let sizePixels;
  let statusDotSize;
  let statusDotBorder;
  let fallbackImageSize;

  switch (size) {
    case 'EXTRA_SMALL':
      sizePixels = 24;
      statusDotSize = 9;
      statusDotBorder = 1.21;
      fallbackImageSize = 14.86;
      break;
    case 'SMALL':
      sizePixels = 32;
      statusDotSize = 10;
      statusDotBorder = 1.42;
      fallbackImageSize = 19.81;
      break;
    case 'MEDIUM':
      sizePixels = 32;
      statusDotSize = 12;
      statusDotBorder = 1.6;
      fallbackImageSize = 24.76;
      break;
    case 'LARGE':
      sizePixels = 80;
      statusDotSize = 18;
      statusDotBorder = 2.4;
      fallbackImageSize = 49.52;
      break;
    case 'EXTRA_LARGE':
      sizePixels = 160;
      statusDotSize = 32;
      statusDotBorder = 4.21;
      fallbackImageSize = 99.05;
      break;
    default:
      sizePixels = 40;
      statusDotSize = 12;
      statusDotBorder = 1.6;
      fallbackImageSize = 24.76;
  }

  const statusIndicatorBackgroundColor =
    statusColor ||
    (availability && getAthleteAvailabilityStyles(availability).color);

  return {
    avatar: css`
      position: relative;
      span {
        margin-bottom: ${statusDotMargin || 0}px;
      }
    `,

    userImage: css`
      width: ${sizePixels}px;
      height: ${sizePixels}px;
      clip-path: circle(50%);
      cursor: ${displayPointerCursor ? 'pointer' : 'auto'};
    `,

    userInitialsBackground: css`
      background-color: ${colors.neutral_400};
      border-radius: 50%;
      cursor: ${displayPointerCursor ? 'pointer' : 'auto'};
      font-size: ${sizePixels * 0.45}px;
      font-weight: 600;
      height: ${sizePixels}px;
      position: relative;
      user-select: none;
      width: ${sizePixels}px;
    `,

    userImageFallback: css`
      background-color: ${colors.neutral_400};
      background-image: url('../img/avatar_kds.svg');
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
      background-color: ${statusIndicatorBackgroundColor};
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
};
