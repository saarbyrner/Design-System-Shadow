// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  totalNotes: css`
    color: ${colors.grey_300_50};
    font-family: Open Sans;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    padding-left: 10px;
  `,
  widgetMenu: css`
    margin: 15px 3px 15px 6px;
    padding: unset;
    i {
      font-size: 30px;
    }
  `,
};
