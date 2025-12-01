// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  wrapper: css`
    min-height: 540px;
  `,
  noNoteText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
};
