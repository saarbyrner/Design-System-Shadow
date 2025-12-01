// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  header: css`
    align-items: flex-start;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin-bottom: 8px;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    width: 100%;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  actions: css`
    display: flex;
    gap: 8px;
  `,
  tableFilters: css`
    display: flex;
    gap: 5px;
    padding-left: 24px;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  filters: css`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  mobileFilters: css`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    gap: 8px;

    > div {
      &:first-of-type {
        max-width: 235px;
      }
    }

    button {
      margin-bottom: 8px;
    }

    @media only screen and (min-width: ${breakPoints.tablet}) {
      align-items: center;
      flex-direction: row;
      button {
        margin-bottom: 0;
      }
    }
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
      margin: 8px 0 0 0;
      width: 100%;
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      min-width: 120px;
      position: relative;
      &:first-of-type {
        width: 240px;
      }
    }
  `,
  'filter--daterange': css`
    @media (max-width: ${breakPoints.tablet}) {
      margin-bottom: 5px;
    }
    @media (max-width: ${breakPoints.desktop}) {
      margin-top: 0;
      width: 235px;
    }
  `,
};
