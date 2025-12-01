// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    flex: 1;
    padding: 24px 24px 8px;
  `,
  header: css`
    grid-column: 1 / 4;
    margin: 0;
  `,
  lineDivider: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 4;
    margin: 8px 0;
    opacity: 0.5;
  `,
  inputLabel: css`
    margin-bottom: 0;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
  `,
  dataContainer: css`
    grid-column: 1 / 2;
    display: flex;
  `,
  dataContainerFull: css`
    grid-column: 1 / 4;
    display: flex;
  `,
  dataContainerSplit: css`
    grid-column: 2 / 4;
    display: flex;
  `,
  dataContainerSplitTwo: css`
    grid-column: 2 / 3;
    display: flex;
  `,
  dataContainerSplitThree: css`
    grid-column: 3 / 4;
    display: flex;
  `,
  data: css`
    margin: 0 0 0 4px;
    color: ${colors.grey_100};
    font-size: 14px;
  `,
  questionHeader: css`
    color: ${colors.grey_100};
    font-weight: 600;
    grid-column: 1/4;
    margin: 0;
  `,
  isInvalid: css`
    color: ${colors.red_200};
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 600;
  `,
  isSubmitted: css`
    color: ${colors.grey_100};
    margin-left: 4px;
    font-size: 14px;
  `,
};
