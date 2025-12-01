// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const gridStyles = {
  athleteName: css`
    font-weight: 600;
    color: ${colors.grey_200};
  `,
  athleteCell: css`
    display: flex;
    align-items: center;
  `,
  athleteCellMeta: css`
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 40px;
    margin-right: 8px;
  `,
  headerIcon: css`
    margin-right: 4px;
    font-size: 16px;
    vertical-align: middle;
  `,
  assistIcon: css`
    font-size: 20px;
  `,
  ownGoalIcon: css`
    color: ${colors.red_400} !important;
  `,
  athletePosition: css`
    font-size: 11px;
    font-weight: 400;
    color: ${colors.grey_100};
  `,
  grid: css`
    margin-top: 16px;

    tr {
      th:first-of-type,
      td:first-of-type {
        padding-left: 24px;
      }
      th:last-of-type,
      td:last-of-type {
        padding-right: 24px;
      }
    }

    .dataGrid__loading {
      margin: 30px;
    }

    .dataGrid__body {
      .athlete__row {
        vertical-align: top;
      }
    }

    .dataGrid__cell {
      width: 600px;
      max-width: 600px;
      padding: 5px;
      overflow: visible;
    }
  `,
};

export default gridStyles;
