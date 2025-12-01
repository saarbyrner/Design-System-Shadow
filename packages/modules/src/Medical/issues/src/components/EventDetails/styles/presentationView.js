// @flow
import { css } from '@emotion/react';

const style = {
  details: css`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    list-style: none;
    margin-bottom: 0;
    padding: 0;

    li {
      line-height: 16px;
    }
  `,
};

export default style;
