// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  question: css`
    padding-bottom: 16px;
    padding-top: 16px;
    border-bottom: 1px solid ${colors.neutral_300};
    &:last-of-type {
      border-bottom: 0px;
      padding-bottom: 0px;
    }
    &:first-of-type {
      padding-top: 0px;
    }
    .kitmanReactSelect,
    .textarea__input {
      width: 297px;
    }
  `,
  followUpQuestion: css`
    padding: 16px 0 22px 16px;
    textarea {
      min-height: unset;
    }
  `,
  heading: css`
    color: ${colors.grey_100};
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
  `,
  headingInfo: css`
    color: ${colors.grey_100};
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.4px;
  `,
};
