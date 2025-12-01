// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  addNoteButton: css`
    padding-top: 16px;
  `,
  description: css`
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.grey_200};
    padding-bottom: 16px;
  `,
  noteContainer: css`
    padding-top: 5px;
    .textarea__input--kitmanDesignSystem {
      min-height: 100px;
    }
  `,
  title: css`
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    color: ${colors.grey_300};
    padding-bottom: 16px;
  `,
  trashButton: css`
    float: right;
  `,
  viewExampleButton: css`
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.grey_300};
    padding-left: 12px;
    &:hover {
      cursor: pointer;
    }
  `,
};
