// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  table: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin-bottom: 8px;
    .dataGrid__cell {
      min-width: 160px;
      &:nth-of-type(1) {
        max-width: 300px;
        min-width: 300px;
      }
      &:nth-of-type(3) {
        max-width: 100px;
        min-width: 100px;
      }
      &:nth-of-type(4) {
        max-width: 300px;
        min-width: 300px;
      }
      &:nth-of-type(5) {
        max-width: 300px;
        min-width: 300px;
      }
    }
  `,
};
