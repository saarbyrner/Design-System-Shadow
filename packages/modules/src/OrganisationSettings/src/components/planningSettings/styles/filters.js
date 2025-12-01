// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';

export default {
  filters: css`
    margin-bottom: 42px;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: flex;
      position: sticky;
      z-index: 5;
    }
  `,
  mobileFilters: css`
    margin-bottom: 42px;
    text-align: right;
    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  mobileFiltersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
  `,
  filter: css`
    @media only screen and (max-width: ${breakPoints.desktop}) {
      margin-right: 0;
      margin-top: 8px;
      width: 100%;
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      flex: 1;
      margin-right: 5px;
      max-width: 220px;
      &:first-of-type {
        min-width: 300px;
      }
    }
  `,
};
