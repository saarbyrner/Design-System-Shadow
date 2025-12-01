// @flow
import { css } from '@emotion/react';
import {
  breakPoints,
  bannerHeights,
  colors,
} from '@kitman/common/src/variables';

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
    position: relative;

    height: calc(100vh - ${bannerHeights.tablet});

    @media only screen and (min-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.tablet});
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.desktop});
    }
  `,
  errorNotificationContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${colors.s14};
    background-color: ${colors.p06};
    bottom: 90px;
    padding: 20px 30px;
    position: absolute;
    width: 100%;
    z-index: 1000;

    &.formation_error {
      bottom: 80px;
    }
  `,
};
