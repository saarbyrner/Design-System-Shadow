// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';

export default {
  table: css`
    &.planningSettingsTable {
      &--edit {
        .planningSettingsTable__rowCell {
          padding: 0;
        }
      }
      .planningSettingsTable__row {
        .dataGrid__cell {
          max-width: 230px;
          min-width: 230px;
          &:first-of-type {
            max-width: 390px;
            min-width: 390px;
            @media only screen and (min-width: ${breakPoints.desktop}) {
              width: 100%;
            }
          }
        }
      }
      .planningSettingsTable__row--principle {
        .dataGrid__cell {
          &:first-of-type {
            @media only screen and (min-width: ${breakPoints.desktop}) {
              width: auto;
            }
          }
        }
      }
      .planningSettingsTable__newRow {
        .planningSettingsTable__rowCell {
          &--name,
          &--squad {
            display: flex;
            align-items: center;
            padding-right: 0;
            > div {
              flex: 1;
            }
            button {
              height: 23px;
            }
          }
        }
      }
    }
  `,
  bulkList: css`
    min-width: 160px;
  `,
  bulkCta: css`
    align-items: center;
    display: flex;
    justify-content: space-between;

    i {
      font-size: 11px;
      margin-right: 14px;
    }
  `,
  rowCell: css`
    padding: 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  action: css`
    margin-top: 7px;
  `,
};
