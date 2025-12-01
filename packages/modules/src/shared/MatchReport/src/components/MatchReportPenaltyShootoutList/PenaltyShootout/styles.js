// @flow

import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  penaltyShootoutRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .delete-penalty-container {
      button {
        opacity: 0;
      }
    }

    &:hover {
      .delete-penalty-container {
        button {
          opacity: 100%;
        }
      }
    }
  `,
  penaltyShootoutContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 5px;
    flex: 1;

    .jerseyNum {
      display: flex;
      flex: 2;
    }

    @media (min-width: ${breakPoints.tablet}) {
      padding: 20px 0px;

      .jerseyNum {
        flex: 3;
      }
    }
  `,
  teamNameArea: css`
    display: flex;
    flex: 4.5;

    .playerSelect {
      width: 120px;
    }

    @media (min-width: ${breakPoints.tablet}) {
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .playerSelect {
        width: 200px;
      }
    }
  `,
  scoredInputs: css`
    display: flex;
    flex: 1.75;

    button {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 40px;
      height: 40px;
      border-radius: 50px;
      background-color: ${colors.white};
      border: 1.5px solid ${colors.neutral_400};

      i {
        color: ${colors.white};
        font-size: 20px;
        font-weight: 700;
      }

      &.success-active {
        background-color: ${colors.green_100};
        border-color: ${colors.green_100};
      }

      &.missed-active {
        background-color: ${colors.red_100};
        border-color: ${colors.red_100};
      }
    }

    @media (min-width: ${breakPoints.tablet}) {
      display: flex;

      justify-content: center;
      flex: 1.3;
    }
  `,
  deleteIcon: css`
    .textButton__icon::before {
      font-size: 24px;
    }

    .delete-icon-hidden {
      cursor: not-allowed;
      pointer-events: none;

      .textButton__icon::before {
        opacity: 0;
      }
    }
  `,
};

export default styles;
