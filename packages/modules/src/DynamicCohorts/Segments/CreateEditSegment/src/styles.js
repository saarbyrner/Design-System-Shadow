// @flow
import { css } from '@emotion/react';

export default {
  container: css`
    margin: 10px 25px;
  `,
  queryBuilder: css`
    display: flex;
    justify-content: space-between;
  `,
  selectStyles: css`
    min-width: 300px;
  `,
  title: css`
    width: 40%;
    margin-bottom: 5px;
  `,
  formActionButtons: css`
    position: fixed;
    bottom: 10px;
    display: flex;
    gap: 5px;
  `,
  grid: css`
    padding-top: 20px;
    tbody {
      tr {
        td {
          padding: 8px;
        }
      }
    }
    tr {
      td:first-of-type {
        padding-left: 24px;
      }
      th:last-child,
      td:last-child {
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
      width: 300px;
      max-width: 600px;
      padding: 8px;
      overflow: visible;
      &:first-of-type {
        &::after {
          display: none;
        }
      }
    }
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 40px;
    width: 40px;
  `,
  athleteCell: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
};
