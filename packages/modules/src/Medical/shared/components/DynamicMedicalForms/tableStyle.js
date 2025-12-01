// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

// @flow
const style = (tableColumns: number) => {
  return {
    table: css`
      grid-column: 1/-1;
    `,
    tableContent: css`
      min-width: calc(100% - 20px);
      overflow: auto;
      display: grid;
      grid-template-columns: auto repeat(${tableColumns - 1}, 1fr);
      margin-left: 20px;
      margin-right: 20px;
      justify-content: space-between;
      border-top: 1px solid ${colors.neutral_300};
      border-bottom: 1px solid ${colors.neutral_300};

      @media (max-width: ${breakPoints.tablet}) {
        grid-template-columns: 1fr;
      }
    `,

    tableTitle: css`
      color: ${colors.grey_200};
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      margin-right: 4px;
    `,

    tableSpacer: css`
      width: max-content;
    `,

    tableQuestionCell: css`
      min-height: 40px;
      display: flex;
      align-items: center;
      float: right;

      @media (max-width: ${breakPoints.tablet}) {
        float: left;
      }
    `,

    tableQuestionAnswer: css`
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid ${colors.neutral_300};
      }
    `,

    tableQuestion: css`
      color: ${colors.grey_200};
      font-weight: 600;
      font-size: 14px;
      margin-left: 20px;
      margin-right: 10px;
      width: 160px;
      float: left;
    `,
    tableAnswer: css`
      color: ${colors.grey_200};
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      min-width: 50px;
      float: right;
    `,
  };
};

export default style;
