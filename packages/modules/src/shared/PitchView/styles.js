// @flow

import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  pitchViewWrapper: css`
    display: flex;
    flex-direction: column;
    padding-bottom: 10vh;
  `,
  pitchWrapper: css`
    display: flex;
    flex-direction: row;
    margin-bottom: 4px;

    > div {
      flex: 1;
      border-radius: 3px;
    }

    & .pitch {
      background: ${colors.white};
      padding: 16px;
      margin-right: 4px;
      margin-bottom: 4px;
    }

    @media (max-width: 1350px) {
      flex-direction: column;

      & .pitch {
        margin-right: 0px;
        margin-bottom: 4px;
      }
    }
  `,
  formationSelectorWrapper: css`
    margin-bottom: 42px;
    display: flex;
    justify-content: end;

    &.event_info_wrapper {
      justify-content: space-between;

      .event_info_text {
        font-size: 14px;
        margin-top: 5px;
        font-weight: 500;
      }
    }
  `,
  substitutionPlayerList: css`
    background: ${colors.white};
  `,
  availablePlayerList: css`
    background: ${colors.white};
  `,
};

export default styles;
