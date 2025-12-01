// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  actionButtons: css`
    display: flex;
    justify-content: space-between;
  `,
  badge: css`
    background-color: ${colors.red_100};
    border-radius: 100%;
    width: 14px;
    height: 14px;
    font-size: 10px;
    color: ${colors.neutral_100};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Open Sans';
    box-shadow: 0 0 0 3px ${colors.white};
    position: absolute;
    top: -7px;
    left: 25px;
  `,

  button: css`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
    margin-left: 16px;
  `,

  header: css`
    align-items: flex-start;
    background: ${colors.p06};
    display: flex;
    flex-direction: column;
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px 24px 0px 24px;
    border-bottom: none;
  `,
  iconButtonWrapper: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 4px;
    gap: 8px;
    position: relative;
    width: 32px;
    height: 32px;
    margin-left: 5px;
    background: ${colors.red_100};
    border-radius: 3px;
  `,

  providerFilter: css`
    width: 150px;
  `,

  titleContainer: css`
    display: flex;
    align-items: center;
    width: 100%;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 24px;
    margin-bottom: 0px;
  `,
  actions: css`
    display: flex;
    gap: 8px;
  `,
  mobileActions: css`
    @media only screen and (min-width: ${breakPoints.tablet}) {
      display: none;
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: none;
    }
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
    gap: 5px;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  tabletFilters: css`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
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
    @media only screen and (max-width: ${breakPoints.tablet}) {
      display: none;
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  tabletFiltersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
  `,
  mobileFilters: css`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    > div {
      &:first-of-type {
        max-width: 235px;
      }
    }
    button {
      margin-bottom: 8px;
    }
    @media only screen and (max-width: ${breakPoints.tablet}) {
      align-items: center;
      flex-direction: row;
      button {
        margin-bottom: 0;
      }
    }
    @media only screen and (min-width: ${breakPoints.tablet}) {
      display: none;
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
};
