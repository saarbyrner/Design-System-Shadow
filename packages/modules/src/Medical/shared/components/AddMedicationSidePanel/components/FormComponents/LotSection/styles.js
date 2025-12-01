// @flow
import { css } from '@emotion/react';

export default {
  addLotButton: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
  `,
  lot: css`
    grid-column: 1 / 5;
    margin-bottom: 16px;
  `,
  lotQuantity: css`
    grid-column: 5 / 8;
    margin-bottom: 16px;
  `,
  optionalQuantity: css`
    grid-column: 5 / 8;
    margin-bottom: 16px;
  `,
  removeLotButton: css`
    grid-column: 8 / 9;
    margin: auto;
  `,
};
