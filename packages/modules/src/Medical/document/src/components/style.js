// @flow
import { css } from '@emotion/react';

export default {
  gridLayout: css`
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-areas: 'content slideout';
  `,
  content: css`
    grid-area: content;
    display: flex;
    flex-flow: column;
    max-width: 100%;
    overflow: hidden;
  `,
  slideout: css`
    grid-area: slideout;

    @media print {
      display: none;
    }
  `,
};
