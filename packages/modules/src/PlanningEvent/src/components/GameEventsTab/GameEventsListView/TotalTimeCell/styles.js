// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const baseStyle = {
  tooltipWidth: css`
    width: 180px;
  `,
  gameActivityTooltipContent: css`
    padding: 16px;
  `,
  gameActivityForm: css`
    align-items: center;
    display: grid;
    grid-gap: 8px 10px;
  `,
  gameActivityFormLabel: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
  `,
  template: css`
    grid-template-columns: 60px 60px;
  `,
  totalTimeContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 5px 10px;
    border: none;
    background-color: inherit;

    &.toggle-time-cell:hover {
      background-color: ${colors.neutral_300};
      border-radius: 3px;
      cursor: pointer;
    }
  `,
};

export default baseStyle;
