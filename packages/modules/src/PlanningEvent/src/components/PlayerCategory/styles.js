// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  categoryName: css`
    background-color: ${colors.neutral_100};
    height: 40px;
    color: ${colors.grey_100};
    display: flex;
    align-items: center;
    padding: 12px 16px;

    > p {
      margin: 0;
    }
  `,
  categoryPlayers: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20;
    padding: 12px 16px;
  `,
};

export default styles;
