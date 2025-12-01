// @flow
import { css } from '@emotion/react';
import { breakPoints, bannerHeights } from '@kitman/common/src/variables';

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

    height: calc(100vh - ${bannerHeights.tablet});

    @media only screen and (min-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.tablet});
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.desktop});
    }
  `,
  shiftContent: css`
    padding-left: 269px;
  `,
};
