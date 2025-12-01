// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  label: {
    default: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 10px;
      padding: 0 6px;
      text-transform: capitalize;
      color: ${colors.grey_300};
      width: auto;

      p {
        margin: 0;
      }
    `,
  },
  dot: {
    default: css`
      width: 8px;
      height: 8px;
      border-radius: 4px;
      margin-right: 6px;
    `,
  },
};
