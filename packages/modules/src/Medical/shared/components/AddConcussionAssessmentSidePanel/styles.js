// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    display: grid;
    column-gap: 16px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
    flex: 1;
    .timePicker__label {
      line-height: 20px;
    }
  `,
  'grid-full': css`
    grid-column: 1 / 5;
    margin-bottom: 16px;
  `,
  'grid-1/3': css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
  `,
  'grid-1/4': css`
    grid-column: 1 / 4;
    margin-bottom: 16px;
  `,
  flexHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
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
  `,
};
