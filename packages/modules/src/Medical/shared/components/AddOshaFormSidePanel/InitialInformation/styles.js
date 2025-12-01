// @flow
import { css } from '@emotion/react';

export default {
  content: css`
    padding: 8px 24px;
    flex: 1;
    p {
      margin-bottom: 24px;
    }
  `,
  initialForm: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    padding-top: 8px;
  `,
  leftColumnContainer: css`
    grid-column: 1 / 2;
  `,
  rightColumnContainer: css`
    grid-column: 2 / 4;
  `,
  rightColumnContainerOverflowHidden: css`
    grid-column: 2 / 4;
    input {
      text-overflow: ellipsis;
    }
  `,
};
