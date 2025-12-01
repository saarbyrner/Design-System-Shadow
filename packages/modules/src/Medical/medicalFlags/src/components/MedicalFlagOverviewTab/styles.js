// @flow
import { css } from '@emotion/react';

import { breakPoints } from '@kitman/common/src/variables';

export default {
  medicalFlagOverviewTab: css`
    display: grid;
    grid-template-columns: 70% 1fr;
    grid-gap: 16px;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 100%;
      grid-gap: 0;
    }
  `,
  mainContent: css`
    > section {
      margin-bottom: 16px;
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
