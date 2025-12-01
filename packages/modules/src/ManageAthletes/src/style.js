// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  bulkActions: css`
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, -50%);
    margin: 0 auto;

    background-color: ${colors.white};
    padding: 1rem;
    box-shadow: 0 0 3px #ccc;
    display: flex;
    gap: 5px;
    align-items: end;
  `,
  selectLength: css`
    width: 150px;
  `,
};
