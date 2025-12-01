// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  divider: css`
    border-bottom: 1px solid ${colors.neutral_300};
    width: 100%;
    margin-top: 20px;
  `,
  sectionLabel: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: ${colors.grey_300};
    padding-bottom: 15px;
    padding-top: 15px;
  `,
  subSection: css`
    padding-top: 16px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    color: ${colors.grey_300};
    padding-right: 5px;
  `,
  overlap: css`
    z-index: 2147483004;
  `,
};
