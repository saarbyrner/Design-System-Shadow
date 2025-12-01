// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
  `,
  attachmentsSection: css`
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
  `,
  attachmentContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  detailLabel: css`
    margin-left: 15px;
    font-weight: 600;
  `,
  attachmentList: css`
    color: ${colors.grey_200};
    padding: 0;
    margin-bottom: 0;
    list-style: none;

    > li {
      border-bottom: 1px solid ${colors.neutral_300};
      padding-bottom: 16px;

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }
  `,
  authorDetails: css`
    font-size: 11px;
    color: ${colors.grey_200};
  `,
  metadataSection: css`
    margin-bottom: 16px;

    &:last-of-type {
      margin-bottom: 0px;
    }
  `,
};
