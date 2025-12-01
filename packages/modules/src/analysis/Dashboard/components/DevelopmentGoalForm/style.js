// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  content: css`
    padding: 16px 24px;
  `,
  fieldRow: css`
    margin-bottom: 16px;
  `,
  dateFieldRow: css`
    display: grid;
    grid-template-columns: 160px 160px;
    grid-gap: 8px;
  `,
  fieldWarningText: css`
    color: ${colors.grey_100_50};
    margin-top: 4px;
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
  `,
  footer: css`
    /* Overwrite  the slide panel action element z-index so the dropdown content appear over it */
    z-index: 0 !important;
  `,
};

export default style;
