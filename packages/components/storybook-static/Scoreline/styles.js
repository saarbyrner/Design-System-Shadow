// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  scoreContainer: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;

    .score {
      text-align: center;
      width: 50px;
      padding: 10px;
      background-color: ${colors.neutral_100};
      font-size: 20px;
      border: none;

      &.score__org {
        margin-left: 15px;
      }

      &.score__opponent {
        margin-right: 15px;
      }
    }

    span {
      font-size: 20px;
      margin: 0px 20px 0px 20px;
    }

    img {
      width: 35px;
    }

    @media (min-width: ${breakPoints.tablet}) {
      margin-bottom: 0px;
    }
  `,
};

export default styles;
