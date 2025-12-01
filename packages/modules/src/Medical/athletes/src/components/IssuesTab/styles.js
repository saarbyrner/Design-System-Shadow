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
        max-width: 340px;
        min-width: 340px;
      }
      &:nth-of-type(3) {
        max-width: 450px;
        min-width: 450px;
      }
    }
  `,
  tableTitle: css`
    color: ${colors.grey_300};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 18px;
  `,
  cell: css`
    padding: 4px 0;
    white-space: pre-line;
  `,
};
