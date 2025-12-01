// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

export default {
  widgetRoot: css`
    background-color: white;
    border-radius: 4px;
    padding: 8px;
    overflow-y: auto;

    // The widget needs to be width/height 100%
    // and overflow hidden to slot into the pages grid system
    width: 100%;
    height: 100%;
    // TODO remove comment here when demo styles are removed
    // overflow: hidden;

    h4 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  `,
  actionButton: css`
    background: transparent;
    border: 0;
    color: ${colors.grey_200};
    outline: none;
  `,
};
