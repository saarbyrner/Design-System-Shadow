// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    margin-bottom: 16px;
  `,
  issueList: css`
    border-collapse: separate;
    border-spacing: 0 8px;

    td.issueSelect {
      min-width: 200px;
    }
    td {
      padding-right: 16px;
    }

    td:last-child {
      padding-right: 0;
    }
  `,
  header: css`
    display: flex;
    justify-content: space-between;
  `,
  actions: css`
    display: flex;
    button {
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
  `,
  dateLabel: css`
    color: ${colors.grey_100};
    font-weight: 600;
    font-size: 12px;
  `,
  loader: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: center;
  `,
};
