// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  container: css`
    padding: 8px 24px;
  `,
  navigationButtonsContainer: css`
    border-top: 2px solid ${colors.neutral_300};
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
  attentionDialog: css`
    padding: 8px 24px;
    p {
      border: 1px solid ${colors.neutral_400};
      padding: 16px;
      color: ${colors.grey_200};
      font-weight: 400;
      span {
        font-weight: 600;
      }
    }
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
