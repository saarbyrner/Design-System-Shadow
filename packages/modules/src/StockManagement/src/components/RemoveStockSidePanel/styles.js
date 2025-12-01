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
    grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
    grid-gap: 10px;
  `,
  label: css`
    color: ${colors.grey_100};
    font-weight: 600;
    font-size: 12px;
  `,
  detail: css`
    color: ${colors.grey_200};
    display: flex;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  `,
  reason: css`
    margin-bottom: 16px;
    width: 50%;
  `,
  quantity: css`
    width: 30%;
    margin-bottom: 16px;
  `,
  noteContent: css`
    width: 100%;
  `,
  errorMessage: css`
    color: ${colors.red_200};
    font-weight: 600;
    font-size: 11px;
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
