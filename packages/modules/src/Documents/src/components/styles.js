// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  wrapper: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    margin: 76px 20px 20px;
    position: relative;
    @media only screen and (min-width: ${breakPoints.tablet}) {
      margin: 16px 20px;
    }
    .dataGrid__row {
      &:not(:first-of-type) {
        .dataGrid__cell {
          padding-top: 8px;
        }
      }
      .dataGrid__cell {
        min-width: 380px;
        padding-bottom: 12px;
        &:nth-of-type(even) {
          max-width: 200px;
          min-width: 200px;
        }
      }
    }
  `,
  header: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 24px;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  inputWrapper: css`
    display: none;
  `,
  action: css`
    @media only screen and (max-width: ${breakPoints.tablet}) {
      display: none;
    }
  `,
  mobileAction: css`
    @media only screen and (min-width: ${breakPoints.tablet}) {
      display: none;
    }
  `,
  lineLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};
