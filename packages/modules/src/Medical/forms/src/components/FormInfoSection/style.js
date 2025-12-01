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
  infoList: css`
    list-style-type: none;
    padding: 0;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
  `,
  detailLabel: css`
    font-weight: 600;
  `,
};
