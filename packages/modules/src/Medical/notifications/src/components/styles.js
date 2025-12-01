// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  title: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    padding: 21px 24px;
  `,
  backButton: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    padding: 15px;
    width: 50px;
    color: ${colors.grey_100};
  `,
  container: css`
    background-color: ${colors.white};
    padding-top: 16px;
  `,
  medicationsContainer: css`
    height: calc(100vh - 130px);
  `,
  iframe: css`
    height: 100%;
    width: 100%;
  `,
  rosterLink: css`
    align-items: center;
    color: ${colors.grey_100} !important;
    display: flex;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    padding: 24px 24px 0px 24px;

    &:hover {
      color: ${colors.grey_100};
      text-decoration: underline;
    }

    i {
      display: inline-block;
      margin-right: 4px;
    }
  `,
};
