// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';

export default {
  formOverviewTab: css`
    display: flex;
    gap: 16px;
    @media (max-width: ${breakPoints.tablet}) {
      display: block;
    }
  `,
  mainContent: css`
    flex: 1;

    > section {
      margin-bottom: 16px;
    }
  `,
  sidebar: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 434px;
    }
  `,
  sectionLoader: css`
    top: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};
