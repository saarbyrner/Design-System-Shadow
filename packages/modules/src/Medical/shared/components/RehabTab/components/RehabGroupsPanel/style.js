// @flow
import { css } from '@emotion/react';
import {
  colors,
  breakPoints,
  zIndices,
  bannerHeights,
} from '@kitman/common/src/variables';

export default {
  rehabGroupsContainer: css`
    margin: 20px 0 0 24px;
    display: inline-flex;
    flex-direction: row;
    align-items: flex-end;
    padding-bottom: 5em;

    div.inputText {
      width: 75%;
      margin-right: 1em;
    }
    .inputRadio {
      margin: 20px 0 0 0;
    }
    div.colorPicker__picker {
      right: 3em;
      margin-top: 1em;
    }
  `,
  panelActionStyles: css`
    border-top: 1px solid ${colors.neutral_300};
    bottom: 0;
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    position: absolute;
    text-align: center;
    width: 100%;
    z-index: 1000;
  `,
  rehabGroupColorSwatch: css`
    background-color: orange;
    border-radius: 3px;
    width: 42px;
    height: 32px;
  `,

  rehabGroupItemContainer: css`
    display: flex;
    align-items: flex-end;
    padding: 20px;
    div.reactCheckbox__checkbox {
      bottom: 0.5em;
    }
  `,

  disabledContent: css`
    opacity: 0.5;
    pointer-events: none;
  `,

  rehabGroupsPanel: css`
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
};
