// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Props } from './index';

// eslint-disable-next-line no-unused-vars
const style = (props: Props) => {
  return {
    eventGroups: css`
      overflow-y: auto;
      margin: 16px 0;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      label: eventGroups;
      > * {
        border-bottom: 0.5px solid ${colors.neutral_300};
        padding: 8px 0;
      }
    `,
    eventGroupTitle: css`
      color: ${colors.grey_300};
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      label: eventGroupsTitle;
    `,
    eventRow: css`
      margin: 8px 0;
    `,
    draggableEvent: css`
      color: ${colors.grey_400};
      cursor: move;
      cursor: grab;
      font-family: 'Open Sans' !important;
      font-weight: 400;
      font-style: normal;
      font-size: 14px !important;
      label: draggableEvent;
      line-height: 26px;
      padding: 0px 8px;
      height: 30px;
      min-width: 264px;
      margin-top: 4px;
      user-select: none;
      z-index: 2;
      ::before {
        color: ${colors.grey_300};
        font-family: 'kitman' !important;
        font-size: 16px !important;
        margin-right: 8px;
        position: relative;
        top: 2px;
      }
      :active {
        cursor: grabbing;
        background: ${colors.neutral_100};
        box-sizing: border-box;
        border-radius: 3px;
      }
      :hover {
        background: ${colors.blue_100_5};
        border: 1px solid ${colors.blue_50};
        box-sizing: border-box;
        box-shadow: 0px 8px 12px rgba(9, 30, 66, 0.15),
          0px 0px 1px rgba(9, 30, 66, 0.31);
        border-radius: 3px;
      }
    `,
    category: css`
      margin: 8px 0;
      border-bottom: 0.5px dotted ${colors.neutral_300};
      label: category;
      :last-child {
        border-bottom: none;
      }
    `,
    categoryName: css`
    color: ${colors.grey_300}
    label: categoryName;
    line-height: 16px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
  `,
    accordion: css`
      background-color: red;
      border-bottom: 0.5px solid green;
    `,
  };
};

export default style;
