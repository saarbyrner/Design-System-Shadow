// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  section: css`
    padding: 24px;
    overflow-x: hidden;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    margin-bottom: 16px;
  `,

  mergedSection: css`
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    overflow-x: hidden;
    background: ${colors.p06};
    border-right: 1px solid ${colors.neutral_300};
    border-left: 1px solid ${colors.neutral_300};
    border-radius: 3px;

    &:nth-of-type(1) {
      padding-top: 24px;
      border-top: 1px solid ${colors.neutral_300};
    }

    &:last-of-type {
      border-bottom: 1px solid ${colors.neutral_300};
      margin-bottom: 16px;
    }
  `,
  sectionSeparator: css`
    margin-top: 14px;
    border-bottom: 1px solid ${colors.neutral_300};
    grid-column: 1 / -1;
  `,
  separator: css`
    border-bottom: 1px solid ${colors.neutral_300};
    grid-column: 1 / -1;
  `,
  sectionElement: css``,
  groupTitle: css`
    display: block;
    grid-column: 1 / -1;
    margin-bottom: -11px;
  `,
  childGroupTitle: css`
    display: block;
    grid-column: 1 / -1;
    margin-top: 14px;
    margin-bottom: 16px;
  `,
  titleHeader: css`
    padding-bottom: 16px;
    margin-bottom: 0px;
  `,
  plainGroupRow: css`
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 16px;
  `,
  childGroupRow: css`
    min-width: 100%;
  `,
  conditionalGroupRow: css`
    border-top: 1px solid ${colors.neutral_300};
    border-bottom: 1px solid ${colors.neutral_300};
    border-left: 5px solid ${colors.neutral_400};
    padding: 14px 14px 14px 24px;
    min-width: 100%;
  `,
  conditionalChildGroupRow: css`
    grid-column: 1 / -1;
    border-top: 1px solid ${colors.neutral_300};
    border-bottom: 1px solid ${colors.neutral_300};
    border-left: 5px solid ${colors.neutral_400};
    padding: 14px 14px 14px 24px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px 16px;
  `,
  question: css`
    color: ${colors.grey_200};
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    margin-right: 4px;
  `,
  answer: css`
    color: ${colors.grey_200};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin: 4px 0px 0px 4px;
  `,
  colorAnswer: css`
    height: 24px;
    width: 24px;
    margin-left: 8px;
    margin-right: 8px;
    border-radius: 3px;
  `,
  rangeAnswer: css`
    display: inline-flex;
  `,
};

export default style;
