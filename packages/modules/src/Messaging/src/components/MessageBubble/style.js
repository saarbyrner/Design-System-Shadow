// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Props } from './index';

// Messaging colours
const messageAuthorColours = [
  colors.grey_300,
  colors.orange_200,
  colors.purple_100,
  colors.teal_100,
  colors.blue_100,
  colors.green_100,
  colors.red_100,
  colors.teal_300,
  colors.blue_300,
  colors.yellow_100,
  colors.orange_100,
];

const messageLog = css`
  background-color: ${colors.p06};
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  border-top-left-radius: 0;
  border-top-right-radius: 14px;
  color: ${colors.cool_mid_grey};
`;

const messageMe = css`
  background-color: ${colors.blue_100};
  color: ${colors.p06};

  a {
    color: ${colors.p06};

    :link {
      color: ${colors.p06};
    }

    :visited {
      color: ${colors.p06};
    }

    :hover {
      color: ${colors.p06};
    }

    :active {
      color: ${colors.p06};
    }
  }
`;

const messageThem = css`
  background-color: ${colors.p06};
  color: ${colors.grey_300};

  a {
    color: ${colors.grey_300};

    :link {
      color: ${colors.grey_300};
    }

    :visited {
      color: ${colors.grey_300};
    }

    :hover {
      color: ${colors.grey_300};
    }

    :active {
      color: ${colors.grey_300};
    }
  }
`;

const style = ({ message, firstMessageInChain, ...props }: Props) => {
  const firstInChainMe = css`
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    border-top-left-radius: 14px;
    border-top-right-radius: ${props.allRoundCorners ? '14px' : '0'};
  `;

  const firstInChainThem = css`
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    border-top-left-radius: ${props.allRoundCorners ? '14px' : '0'};
    border-top-right-radius: 14px;
  `;

  return {
    message: css`
      font-family: 'Open Sans';
      font-size: 14px;
      font-style: normal;
      font-variant: normal;
      font-weight: 400;
      line-height: 20px;
      border-radius: 10px;
      margin-bottom: 2px;
      min-width: 40px;
      padding-bottom: 5px;
      padding-left: 12px;
      padding-right: 12px;
      padding-top: 12px;
      width: fit-content;
      ${message.messageType === 'LOG' && messageLog}
      ${message.messageType === 'ME' && messageMe}
      ${message.messageType === 'THEM' && messageThem}
      ${firstMessageInChain && message.messageType === 'ME' && firstInChainMe}
      ${firstMessageInChain &&
      message.messageType === 'THEM' &&
      firstInChainThem}
    `,
    messageHeader: css`
      display: block;
    `,
    messageAuthor: css`
      display: inline;
      font-weight: 600;
      color: ${messageAuthorColours[message.authorDetails?.colourNumber || 1]};
    `,
    messageBody: css`
      display: flex;
      flex-direction: column;
      white-space: pre-wrap;
      word-break: break-word;
    `,
    messageFooter: css`
      float: right;
      font-size: 12px;
      margin-left: 8px;
      padding-top: 5px;
      align-items: center;
      display: inline-flex;
      flex-wrap: nowrap;
      gap: 4px;
    `,
    messageImage: css`
      background-color: ${colors.p06};
      border-radius: 5px;
      object-fit: contain;
      max-width: 360px;
      max-height: 360px;
    `,
    messageReadStatus: css`
      :hover {
        text-decoration: underline;
        cursor: pointer;
      }
    `,
    mediaHeader: css`
      align-items: center;
      display: flex;
      justify-content: space-between;
    `,
    mediaHolder: css`
      text-align: center;
      width: 100%;

      video {
        height: auto !important;
        width: 100% !important;
      }
    `,
    mediaIcon: css`
      display: block;
      font-size: 50px;
    `,
    mediaName: css`
      font-size: 14px;
      line-height: 30px;
      margin: 0 5px;
      text-decoration: underline;
    `,
    expiredAudio: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 54px;
      justify-content: center;
      line-height: 20px;
      width: 300px;

      :hover {
        cursor: pointer;
      }
    `,
    expiredVideo: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100px;
      justify-content: center;
      line-height: 20px;
      width: 300px;

      :hover {
        cursor: pointer;
      }
    `,
    messageTime: css``,
    mediaLink: css``,
  };
};

export default style;
