// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  customPeriodListContainer: css`
    display: flex;
    flex-direction: column;

    .InputNumeric {
      width: 150px;
      margin-bottom: 10px;
    }
  `,
  errorText: css`
    color: ${colors.red_100};
    font-size: 12px;
  `,
};

export default styles;
