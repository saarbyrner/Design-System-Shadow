// @flow

import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  penaltyShootoutListWrapper: css`
    display: flex;
    flex-direction: column;
    background: ${colors.white};
    height: 100%;
    padding: 20px;
    flex: 1;
  `,
  penaltyShootoutHeader: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    .shootoutListTitle {
      font-size: 18px;
      font-weight: 600;
      color: ${colors.grey_200};
      margin-bottom: 5px;
    }
  `,
  teamShootoutListContainer: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
  `,
  teamShootoutHeader: css`
    display: flex;
    padding-right: 13%;

    span {
      font-size: 14px;
      font-weight: 600;
      padding-right: 3%;

      color: ${colors.grey_100};
    }

    .teamName {
      flex: 2.5;
      font-size: 16px;
      color: ${colors.grey_200};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .jerseyNum {
      flex: 1;
    }

    .scoredInputs {
      flex: 1;
    }

    @media (min-width: ${breakPoints.tablet}) {
      padding-right: 0%;

      span {
        padding-right: 1%;
      }
      .teamName {
        flex: 4.5;
      }

      .jerseyNum {
        flex: 3;
      }

      .scoredInputs {
        flex: 1.3;
      }
    }

    @media (min-width: ${breakPoints.desktop}) {
      padding-right: 4%;
    }
  `,
  penaltyListBorder: css`
    background-color: ${colors.neutral_100};
    opacity: 50%;
    height: 0.5px;
    width: 100%;
    margin: 7.5px 0px;
  `,
};

export default styles;
