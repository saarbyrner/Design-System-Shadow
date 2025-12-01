// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

export default {
  noteVisibility: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    h4 {
      margin-bottom: 8px;
      text-transform: capitalize;
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }

    p {
      margin-bottom: 0px;
    }

    button {
      justify-content: start;
      margin-bottom: 8px;
    }

    span {
      margin-left: 12px;
    }
  `,
};
