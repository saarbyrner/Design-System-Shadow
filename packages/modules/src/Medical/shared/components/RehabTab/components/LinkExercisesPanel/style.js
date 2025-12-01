// @flow
import { css } from '@emotion/react';
import {
  colors,
  breakPoints,
  zIndices,
  bannerHeights,
} from '@kitman/common/src/variables';

export default {
  linkExercisePanel: css`
    z-index: ${zIndices.slidingPanel};
    background-color: ${colors.white};
    filter: drop-shadow(0px 2px 8px ${colors.light_transparent_background})
      drop-shadow(0px 2px 15px ${colors.semi_transparent_background});
    overflow-x: clip;
    position: relative;

    @media only screen and (min-width: ${breakPoints.desktop}) {
      height: 100vh;
      max-height: 100vh;
      top: -${bannerHeights.tablet};
      margin-bottom: -${bannerHeights.tablet};
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      height: 100vh;
      max-height: 100vh;
      top: -${bannerHeights.desktop};
      margin-bottom: -${bannerHeights.desktop};
    }
  `,

  scrollingContainer: css`
    overflow-y: auto;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    label: eventGroups;
    flex: 1;
    padding: 24px;
  `,

  content: css`
    display: grid;
    row-gap: 16px;
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    overflow: auto;
    flex: 1;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
    gap: 8px;
  `,
};
