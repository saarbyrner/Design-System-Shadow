// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';

export default {
  filters: css`
    display: flex;
    padding: 10px 25px;
    align-items: center;
    z-index: 4;
  `,
  'filters--desktop': css`
    gap: 5px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    gap: 5px;

    button {
      margin-bottom: 8px;
    }

    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }

    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  filtersPanel: css`
    padding: 25px;
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 140px;

      .inputText {
        width: 200px;
      }
    }

    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  clubFilter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 90px;
    }
  `,
};
