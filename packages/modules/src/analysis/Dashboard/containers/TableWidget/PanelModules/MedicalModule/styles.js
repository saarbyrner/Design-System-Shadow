// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  asyncSelectContainer: css`
    margin: 10px 20px;
    margin-top: 10px;

    .kitmanReactSelect .kitmanReactSelect__value-container {
      max-height: 200px;
      height: unset;
      overflow: auto;

      [class$='-ValueContainer'] {
        display: none;
      }
    }

    .iconButton.icon-close {
      padding: 0;
      min-width: auto;
      width: 20px;
      height: 20px;
      font-weight: bold;
      color: ${colors.grey_100};

      ::before {
        font-size: 16px;
      }
    }
  `,
};

export default styles;
