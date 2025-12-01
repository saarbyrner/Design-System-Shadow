// @flow
import { css } from '@emotion/react';
import {
  colors,
  breakPoints,
  zIndices,
  bannerHeights,
} from '@kitman/common/src/variables';

export default {
  exerciseListPanel: css`
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

  searchInputs: css`
    display: flex;
    align-items: center;
    padding: 10px 24px;
    border-bottom: 1px solid ${colors.neutral_300};
    gap: 4px;
  `,

  searchBar: css`
    flex: 1;
  `,

  searchOptions: css`
    min-width: 120px;
  `,

  scrollingContainer: css`
    overflow-y: auto;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    label: eventGroups;
    > * {
      border-bottom: 0.5px solid ${colors.neutral_300};
      padding: 0 0;
    }
  `,
};
