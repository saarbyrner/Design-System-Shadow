// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  groupSelector: css`
    .inputText {
      padding-bottom: 15px;
      border-bottom: 1px solid ${colors.neutral_300};
    }
  `,
  groupListIcon: css`
    font-weight: bold;
    font-size: 16px;
    margin-top: 2px;
  `,
  loading: css`
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

export default style;
