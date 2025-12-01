// @flow

import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

const styles = {
  matchRequestMainBody: css`
    background: ${colors.white};
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 10px 0px;
    overflow-x: scroll;

    h4 {
      margin-bottom: 20px;
    }
  `,

  matchRequestTable: css`
    min-width: 1050px;
    margin-top: 20px;

    .table-header {
      display: flex;
      flex-direction: row;
      padding-bottom: 9px;
      border-bottom: 1px solid ${colors.neutral_300};

      p {
        font-size: 14px;
        font-family: 'Open Sans';
        font-weight: 600;
        line-height: 16px;
        color: ${colors.grey_100};
      }
    }

    .table-body {
      display: flex;
      flex-direction: column;
      margin-top: 15px;

      hr {
        border-bottom: 1px solid ${colors.neutral_300};
        width: 100%;
      }
    }

    [data-table-cell='scoutName'],
    [data-table-cell='teamName'] {
      p {
        font-size: 14px;
        color: ${colors.grey_200};
        font-weight: 600;
      }
    }

    [data-table-cell='teamName'] {
      display: flex;
      align-items: center;

      img {
        width: 33px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    [data-table-cell='matchInfoUpload'] {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .matchRequestsFileName {
        font-weight: 700;
        word-break: break-all;
      }

      button {
        margin-left: 10px;
      }
    }
  `,

  smallCellSize: css`
    flex: 0.2;
  `,

  checkbox: css`
    display: flex;
    flex: 0.1;
    justify-content: center;
  `,

  mediumCellSize: css`
    flex: 0.3;
  `,

  largeCellSize: css`
    flex: 0.5;
  `,

  matchRequestTableRow: css`
    display: flex;
    align-items: center;

    padding: 15px 0px;

    .status-action-area {
      display: flex;

      button {
        margin-right: 10px;
      }
    }
  `,
};

export default styles;
