// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    h2 {
      color: ${colors.grey_300};
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
  `,
  additionalDetailsSection: css`
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${colors.neutral_300};
  `,
  additionalDetails: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    position: relative;
    margin-top: 16px;
    margin-bottom: 0;
    li {
      line-height: 16px;
    }
  `,
  detailLabel: css`
    font-weight: 600;
  `,
  detailValue: css`
    color: ${colors.grey_200};
  `,
};
