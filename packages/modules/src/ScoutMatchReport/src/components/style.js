// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  layout: css`
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-areas: 'content slideout';
    background-color: ${colors.s23};

    @media (min-width: ${breakPoints.tablet}) {
      padding: 16px 20px;
    }
  `,
  content: css`
    grid-area: content;
    display: flex;
    flex-flow: column;
    max-width: 100%;
    overflow: hidden;
  `,
};
