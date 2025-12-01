// @flow
import { css } from '@emotion/react';

const style = {
  toggle: css`
    padding-top: 5px;
  `,
  exerciseHeader: css`
    line-height: 18px;
    padding: 0;

    > div {
      padding-block: 0;
    }
  `,
  dataGridTable: css`
    .react-grid-Grid {
      min-height: 100% !important;
    }
  `,
};

export default style;
