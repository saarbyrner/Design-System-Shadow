// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    width: 100%;
    height: 60px;
    background: ${colors.white};
    display: flex;
    align-items: center;

    h1 {
      margin: 0px 24px 0px;
    }
  `,
  contentContainer: css`
    margin: 12px 22px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  `,
};
