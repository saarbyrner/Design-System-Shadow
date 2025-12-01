// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  groupBy: css`
    width: 100%;
    border-bottom: 1px solid ${colors.neutral_300};
    padding-bottom: 15px;
  `,
  loading: css`
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  backButton: css`
    margin-top: 15px;
    a {
      color: ${colors.grey_200};
      font-weight: 400;
      font-size: 14px;
      cursor: pointer;

      i {
        padding-right: 5px;
        font-size: 16px;
        font-weight: bold;
        vertical-align: -2px;
      }
    }
  `,
};

export default style;
