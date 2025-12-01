// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    padding: 8px 24px;
    flex: 1;
  `,
  sectionTitle: css`
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    grid-column: 1 / 4;
    color: ${colors.grey_200};
  `,
  initialForm: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    padding-top: 8px;
    .radioList {
      grid-column: 1 / 4;

      &__mainLabel {
        font-size: 12px;
        margin: 0;
      }
    }
  `,
  leftColumnContainer: css`
    grid-column: 1 / 2;
  `,
  rightColumnContainer: css`
    grid-column: 2 / 4;
  `,
  streetContainer: css`
    grid-column: 1 / 4;
  `,
  stateContainer: css`
    grid-column: 2 / 3;
  `,
  zipContainer: css`
    grid-column: 3 / 3;
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
  infoText: css`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    grid-column: 1 / 4;
    color: ${colors.grey_100};
    margin: 0;
  `,
};
