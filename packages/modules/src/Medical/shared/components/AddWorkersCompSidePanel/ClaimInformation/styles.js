// @flow
import { css } from '@emotion/react';
import colors from '../../../../../../../common/src/variables/colors';

export default {
  content: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    flex: 1;
    padding: 8px 24px;
  `,
  firstHalfContainer: css`
    grid-column: 1 / 2;
  `,
  secondHalfContainer: css`
    grid-column: 2 / 4;
  `,
  lineDivider: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 4;
    margin: 8px 0;
    opacity: 0.5;
  `,
  fullWidthContainer: css`
    grid-column: 1 / 4;
  `,
};
