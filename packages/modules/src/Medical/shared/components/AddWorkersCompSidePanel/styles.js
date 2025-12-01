// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  container: css`
    padding: 8px 24px;
  `,
  progressBar: css`
    padding: 0px 24px;
  `,
  navigationButtonsContainer: css`
    align-items: center;
    background: ${colors.white};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
    gap: 16px;
  `,
  backButton: css`
    margin-right: auto;
  `,
  invalidList: css`
    display: block;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    margin: 24px 24px 16px 24px;
    padding: 18px 16px;
    h6 {
      color: ${colors.red_200};
    }
    ul {
      list-style: none;
    }
    &:last-of-type {
      margin-bottom: 0px;
    }
  `,
  alertIcon: css`
    margin-right: 8px;
  `,
};
