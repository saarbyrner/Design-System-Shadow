// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  tabBar: css`
    .rc-tabs {
      border: 0;
      overflow: visible;

      &::before {
        background-color: ${colors.neutral_300};
        content: '';
        height: 2px;
        position: absolute;
        top: 37px; /* height of the tabs bar */
        width: 100%;
        z-index: 1;
      }
    }

    .rc-tabs-bar {
      border-bottom: none;
      padding: 0 5px;

      @media only screen and (max-width: ${breakPoints.desktop}) {
        overflow-x: auto;
        max-width: 100%;

        > div {
          display: inline-flex;
        }
      }
    }

    .rc-tabs-tab {
      padding: 15px;

      &:hover {
        color: ${colors.grey_300};
      }

      &-active {
        color: ${colors.grey_300};

        &:hover {
          color: ${colors.grey_300};
        }
      }
    }

    .rc-tabs-ink-bar {
      background-color: ${colors.grey_300};
      border-radius: 8px;
    }

    .rc-tabs-tabpane {
      padding: 16px 20px;
    }
  `,
  tabBar_kitmanDesignSystem: css`
    .rc-tabs-bar {
      padding: 0;
    }

    .rc-tabs-tabpane {
      background-color: ${colors.background};
      padding: 16px 20px;
    }

    .rc-tabs-tab {
      color: ${colors.grey_100};
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      padding: 7.5px 0 9.5px 0;

      &:hover {
        color: ${colors.grey_300};
      }

      &-active {
        color: ${colors.grey_300};

        &:hover {
          color: ${colors.grey_300};
        }
      }
    }

    .rc-tabs-ink-bar {
      background-color: ${colors.grey_300};
    }
  `,
};

export default styles;
