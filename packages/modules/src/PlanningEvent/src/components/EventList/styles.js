// @flow

import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  eventListWrapper: css`
    display: flex;
    flex-direction: column;

    .eventButtonSelector {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background: ${colors.white};
      padding: 15px;
      margin-bottom: 6px;

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 0px 5px;
        padding: 0px 15px;

        height: 45px;
        border: none;
        border-radius: 3px;
        cursor: pointer;

        &:hover,
        &:active {
          background: ${colors.grey_100_50};
          border-color: ${colors.grey_100_50};

          .invertColor {
            filter: invert(100%) sepia(16%) hue-rotate(222deg) brightness(150%)
              contrast(115%);
          }
        }

        img {
          width: 18px;
          margin-right: 5px;

          &.mediumImage {
            width: 12px;
          }
        }

        span {
          white-space: nowrap;
        }

        &:disabled {
          cursor: not-allowed;
        }
      }

      .selectedButton {
        background: ${colors.grey_100};
        border-color: ${colors.grey_100};

        .invertColor {
          filter: invert(100%) sepia(16%) hue-rotate(222deg) brightness(150%)
            contrast(115%);
        }
      }
    }
  `,
  eventListAreaContainer: css`
    display: flex;
    flex-direction: column;
    background: ${colors.white};
    height: 100%;
    padding: 20px;

    .eventListBorder {
      background-color: ${colors.neutral_100};
      height: 1px;
      width: 100%;
      margin: 15px 0px;
    }
  `,
  eventListAreaHeader: css`
    display: flex;
    flex-direction: column;

    .eventListTitle {
      font-size: 18px;
      font-weight: 600;
      color: ${colors.grey_200};
      margin-bottom: 5px;
    }

    .eventListHeaderMobileTitle {
      display: flex;
      justify-content: space-between;
    }

    .eventListFiltersArea {
      display: flex;
      flex-direction: column;

      .eventListFilters {
        display: flex;
      }

      .kitmanReactSelect {
        border-radius: 4;
        font-size: 11px;
        width: 150px;
        color: ${colors.grey_300};

        margin-right: 5px;
      }

      button {
        margin-top: 23px;
        width: fit-content;
      }
    }

    @media (min-width: ${breakPoints.tablet}) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .eventListTitle {
        margin-bottom: 0px;
      }

      .eventListFiltersArea {
        flex-direction: row;
        .kitmanReactSelect {
          width: 175px;
        }
      }
    }
  `,
  gameEventContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    cursor: pointer;
    padding: 0px 10px;

    div {
      white-space: nowrap;
    }

    &.selected_event {
      border-left: 1px solid ${colors.grey_200};
      border-right: 1px solid ${colors.grey_200};
    }

    .gameEventHeaderRow {
      display: flex;
      flex-direction: row;

      justify-content: space-between;
      margin-bottom: 10px;

      .eventImage {
        width: 24px;
        max-height: 28px;
        margin-right: 13px;

        &.red_card,
        &.yellow_card {
          width: 24px;
          max-height: 32px;
        }

        &.goal,
        &.position_swap {
          width: 28px;
        }
      }

      .light-text {
        color: ${colors.grey_100};
        font-size: 13px;
        padding-right: 10px;
        width: 30px;
      }

      .mid-text {
        color: ${colors.grey_200};
        font-size: 15px;
        margin-top: 3px;
      }

      .gameEventHeaderInfo {
        display: flex;
        width: calc(100% - 42px);
      }
      .gameEventHeaderDeleteButton {
        display: flex;
        .textButton__icon::before {
          font-size: 18px;
        }
      }
    }

    .gameEventInfoRow {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .minute-info {
        display: flex;
        margin-bottom: 10px;

        .InputNumeric {
          width: 31.5%;
          margin-right: 35px;
        }
      }

      .playerSelect,
      .formationSelect {
        width: 200px;
        margin-right: 15px;
      }

      .reasonSelect {
        width: 300px;

        .kitmanReactSelect__option {
          white-space: normal;
        }
      }

      .positionSelect {
        width: 75px;
      }
    }

    @media (min-width: ${breakPoints.tablet}) {
      .gameEventInfoRow {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .minute-info {
          display: flex;
          margin-bottom: 0px;

          .InputNumeric {
            width: 100px;
          }
        }

        .positionSelect {
          width: 100px;
        }
      }
    }
  `,
  avatarInfo: css`
    display: flex;
    flex-direction: row;
    border-left: 1px solid ${colors.neutral_300};
    padding-left: 10px;
    min-width: 0;

    .avatarDetails {
      display: flex;
      flex-direction: column;
      min-width: 0;

      p {
        margin-bottom: 0px;
      }

      .playerName {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .playerPosition {
        font-size: 11px;
        color: ${colors.grey_100};
      }
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      margin-right: 10px;
    }
  `,
};

export default styles;
