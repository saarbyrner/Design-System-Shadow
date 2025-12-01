// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-top: 0px;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
    position: sticky;
    right: 0;
  `,
  stockTable: css`
    padding: 24px;
    .dataTable {
      overflow: auto;
    }
    .dataTable__thead {
      background: white;
    }
    .dataTable__th,
    .dataTable__td {
      display: flex;
      align-items: center;
      background: ${colors.white};
      box-shadow: 4px 0px 3px ${colors.neutral_300};
      padding: 5px 20px 5px 0;
    }
  `,
  noStockLots: css`
    text-align: center;
    padding-bottom: 20px;
  `,
};
