// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  attachmentItem: css`
    list-style-type: none;
    padding: 0;
    padding-bottom: 16px;
    margin-bottom: 18px;
    margin-top: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
  `,
  attachmentDetails: css`
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
  `,
  detailLabel: css`
    font-weight: 600;
  `,
  attachmentIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  attachmentLink: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 600;
    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }
    &:hover {
      text-decoration: underline;
    }
  `,
};
