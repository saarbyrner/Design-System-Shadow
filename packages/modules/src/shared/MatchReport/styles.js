// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  matchReportHeader: css`
    background-color: ${colors.p06};
    margin-bottom: 5px;
    padding: 24px;

    .league-edit-buttons,
    .officials-header-buttons {
      display: flex;
      button {
        margin-left: 5px;
      }
    }
  `,
  matchReportHeaderWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: ${colors.white};
    padding: 10px 0px;
    margin-bottom: 5px;
  `,
  matchReportScorelineArea: css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    @media (min-width: ${breakPoints.desktop}) {
      flex-direction: row;

      .penalty-toggle-container {
        flex: 1;
        margin: 5px 0 0 15px;
      }
      &.multiElement::after {
        flex: 1;
        content: '';
      }

      &.onlyScoreline {
        justify-content: center;
      }
    }
  `,
  matchReportPenaltyInfoArea: css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;

    span {
      font-size: 16px;
      color: ${colors.grey_200};
      margin: 0px 5px;
    }

    .penalty-dot {
      height: 12px;
      width: 12px;
      background-color: ${colors.neutral_500};
      border-radius: 50%;
      margin: 6px 3px;

      &.success-dot {
        background-color: ${colors.green_100};
      }

      &.missed-dot {
        background-color: ${colors.red_100};
      }
    }
  `,
  eventTitleWrapper: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  eventTitle: css`
    color: $colour-grey-300;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  `,
  eventActions: css`
    display: flex;

    button {
      margin-left: 4px;
    }
  `,
  eventTime: css`
    color: $colour-grey-300;
    font-size: 14px;
    line-height: 20px;
  `,
  headerButtons: css`
    display: flex;
    button {
      margin-left: 5px;
    }
  `,
  matchReportPageContainer: css`
    display: flex;
    flex-direction: column;
  `,
  matchReportTeamEventWrapper: css`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    min-height: 50vh;

    .team-list-area {
      background: ${colors.white};
      margin-right: 4px;
      flex: 1;
    }

    .event-list-area {
      flex: 1;
      margin-left: 4px;
    }

    @media (max-width: 1350px) {
      flex-direction: column;
    }
  `,
  teamListArea: css`
    background: ${colors.white};
    margin-right: 4px;
    flex: 1;
  `,
  row: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
    margin: 16px;
    margin-bottom: 0;

    @media (min-width: ${breakPoints.tablet}) {
      flex-direction: row;
    }
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: row;
    background: ${colors.white};
    margin-top: 5px;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 100px;
      padding: 10px 25px;
      height: 32px;
      font-size: 14px;
      border-radius: 5px;
    }
  `,
  teamGrid: css`
    padding: 0;
    margin-bottom: 10px;

    .player-avatar-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;

      &.athlete,
      &.staff {
        cursor: pointer;

        span {
          &:hover {
            color: ${colors.grey_300_50};
          }

          &.selected_player {
            color: ${colors.teal_200};
          }
        }
      }

      img {
        width: 25px;
        border-radius: 15px;
        margin-right: 10px;
      }

      span {
        color: ${colors.grey_200};
        font-weight: 600;
        font-size: 14px;
      }
    }

    .secondary-cell-data {
      color: ${colors.grey_100};
      font-size: 13px;
    }
  `,
  textAreaContainer: css`
    display: flex;
    background: ${colors.white};
    flex-direction: column;
    padding: 16px 16px 25px 16px;

    .rich-text-display {
      margin-bottom: 15px;
    }
  `,
  button: css`
    all: unset;
  `,
};

export default styles;
