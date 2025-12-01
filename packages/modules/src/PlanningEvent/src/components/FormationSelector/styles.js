// @flow
import { css } from '@emotion/react';

export default {
  wrapper: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  clearFormationButton: css`
    display: flex;
    margin-top: 23px;
    margin-left: 10px;

    &.clearButtonArea {
      margin-top: 0px;
    }
  `,
};
