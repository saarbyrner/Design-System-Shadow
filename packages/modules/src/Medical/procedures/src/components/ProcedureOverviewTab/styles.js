// @flow
import { css } from '@emotion/react';

import { colors, breakPoints } from '@kitman/common/src/variables';

export default {
  ProcedureOverviewTab: css`
    display: grid;
    grid-template-columns: 0.75fr 0.25fr;
    grid-gap: 16px;

    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `,
  mainContent: css`
    > section {
      margin-bottom: 16px;
    }
  `,
  sidebar: css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;

    > div {
      background-color: ${colors.white};
      border: 1px solid ${colors.neutral_300};
      border-radius: 3px;
      padding: 24px;
      position: relative;
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
