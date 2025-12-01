// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    display: grid;
    padding: 24px;
    flex-grow: 1;
  `,
  stockDetails: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
  `,
  gridRow1: css`
    grid-row: 1;
  `,
  gridRow2: css`
    grid-row: 2;
  `,
  gridRow3: css`
    grid-row: 3;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
    gap: 8px;
    justify-self: flex-end;
    align-self: flex-end;
  `,
};
