// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

const styles = {
  wrapper: css`
    background-color: ${colors.white};
    box-shadow: 0 1px 4px 0 #00000026;
    border: 1px solid #f3f3f3;
    overflow: scroll;
    min-height: 100vh;

    @media (min-width: 1050px) {
      overflow: auto;
    }

    header {
      padding: 24px 24px 16px 24px;
      display: flex;
      flex-direction: row;
    }

    h3 {
      color: ${colors.grey_300};
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 24px;
      display: flex;
      flex-grow: 1;
    }
  `,

  actions: css`
    display: flex;
    flex-direction: row;
    gap: 4px;
  `,

  emptyState: css`
    text-align: center;
    margin: 50px 0;
  `,
  laodingState: css`
    text-align: center;
    margin: 50px 0;
  `,
  table: css`
    min-width: 1050px;

    .table-header {
      display: flex;
      flex-direction: row;
      padding-bottom: 9px;
      border-bottom: 1px solid ${colors.neutral_300};

      p {
        font-size: 12px;
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 600;
        line-height: 16px;
        color: ${colors.grey_100};
      }
    }

    .table-row {
      display: flex;
      flex-direction: row;
      padding: 12px 0px;
      border-bottom: 1px solid ${colors.neutral_300};
      transition: 0.5s ease-in;
  
      &:hover {
        background-color: #e7e7e7;
      }

      .status {
        padding: 1px 10px;
        border-radius: 30px;
        font-family: 'Open Sans';
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: center;
        color: ${colors.grey_300};
        text-transform: capitalize;
      }
    }

    [data-table-cell] {
      display: flex;
      align-items: center;
      font-family: 'Open Sans';
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: left;
      color: ${colors.grey_200};

      p {
        margin-bottom: 0;
      }
    }

    [data-table-header],
    [data-table-cell],
    [data-table-header='approval'],
    [data-table-cell='approval'] {
      flex: 0.3;
    }

    [data-table-header='home-team'],
    [data-table-cell='home-team'] {
      padding-left: 24px;
    }

    [data-table-header='home-team'],
    [data-table-cell='home-team'],
    [data-table-header='away-team'],
    [data-table-cell='away-team'],
    [data-table-header='start-time'],
    [data-table-cell='start-time'],
    [data-table-header='location'],
    [data-table-cell='location'] {
      flex: 0.5;
    }

    [data-table-header='score'],
    [data-table-cell='score'],
    [data-table-header='match-id'],
    [data-table-cell='match-id'],
    [data-table-header='time'],
    [data-table-cell='time'] {
      flex: 0.2;
    }

    [data-table-header='squad'],
    [data-table-cell='squad'],
    [data-table-header='competition'],
    [data-table-cell='competition'],
    [data-table-header='requests'],
    [data-table-cell='requests'],
    [data-table-header='scout'],
    [data-table-cell='scout'],
    [data-table-header='requesting-club'],
    [data-table-cell='requesting-club'],
    [data-table-header='game'],
    [data-table-cell='game'],
    [data-table-header='game-id'],
    [data-table-cell='game-id'],
    [data-table-header='age-group'],
    [data-table-cell='age-group'],
    [data-table-header='date'],
    [data-table-cell='date'] {
      flex: 0.4;
    }

    [data-table-header='location'],
    [data-table-cell='location'] {
      flex: 0.25;
    }

    [data-table-cell='home-team'],
    [data-table-cell='away-team'] {
      font-family: 'Open Sans';
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: #3b4960;
    }

    [data-table-header='menu'],
    [data-table-cell='menu'] {
      display: flex;
      flex: 0.1;

      div:first-of-type {
        width: 100%;
        height: 100%;
      }

      button {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
      }
    }

    [data-table-header='requests'],
    [data-table-cell='requests'] {
      button {
        border-radius: 15px;

        &:hover {
          background-color: ${colors.colour_warm_light_grey};
        }
      }

      .approvedStatusCell {
        display: flex;
        align-items: center;
        button {
          margin-left: 10px;
        }
      }
    }

    .home-team {
      margin-right: 15px;
    }
    .away-team {
      margin-left: 15px;
    }

    .home-team,
    .away-team {
      margin-bottom: 0px;
      width: 65%;
      min-width: 65%;
    }

    .empty-home-team {
      text-align: right;
    }

    .team-flag {
      width: 33px;
      border-radius: 50%;
    }
  `,
  tableRow: css`
    .cell-team {
      align-items: center;
      color: ${colors.grey_300};
      font-family: 'Open Sans';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
  `,
  searchBarContainer: css`
    width: 240px;
    position: relative;

    input {
      height: 37px;
      padding: 8px 35px 8px 11px;
    }

    & .icon-search {
      margin: 0;
      top: 5px;
    }
  `,
  filterContainer: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;

    @media (min-width: ${breakPoints.desktop}) {
      flex-direction: row;

      .inputText {
        width: 240px;
      }
    }
  `,
  filter: css`
    margin-bottom: 5px;
    @media (min-width: ${breakPoints.desktop}) {
      margin-right: 10px;
      margin-bottom: 0px;
      flex: 1;

      &:nth-of-type(1) {
        flex: 1;
      }
    }
  `,
  green: {
    backgroundColor: colors.green_100_20,
  },
  yellow: {
    backgroundColor: colors.yellow_200,
  },
  blue: {
    backgroundColor: colors.mui_blue_100,
  },
  red: {
    backgroundColor: colors.red_100_20,
  },
  pagination: css`
    padding: 24px;
    display: flex;
    justify-content: center;
  `,
};

export default styles;
