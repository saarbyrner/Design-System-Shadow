// @flow

import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

const styles = {
  wrapper: css`
    flex: 1;
    background: ${colors.white};
  `,
  header: css`
    padding: 16px;

    @media (min-width: 688px) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px;
      padding-left: 16px;
    }
  `,
  heading: css`
    color: ${colors.grey_200};
    margin: 0;
    padding: 24px 0px;
    font-family: Open Sans;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  `,
  actions: css`
    display: flex;
    flex-direction: row;

    & > * {
      margin-right: 16px;
      color: ${colors.grey_100};
      font-weight: 600;
    }

    .kitmanReactSelect {
      width: 150px;
    }

    button {
      padding: 5px 10px;
      background-color: ${colors.neutral_200};
    }
  `,
  emptyPlayers: css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 50vh;

    p {
      color: ${colors.grey_100};
      font-weight: 600;
    }
  `,
  subPlayers: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0px 15px;
    .subArea {
      background-color: ${colors.neutral_100};
      border-radius: 3px;
      margin: 0px 12px 12px 0px;
      width: 175px;
      .player-avatar-wrapper {
        margin-bottom: 0px;
        margin-right: 0px;
        width: 100%;
      }
      .player-avatar-info {
        padding: 20px 20px;
      }
    }
    @media (min-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media (min-width: 475px) {
      .subArea {
        width: inherit;
        p {
          white-space: nowrap;
        }
      }
    }
  `,
};

export default styles;
