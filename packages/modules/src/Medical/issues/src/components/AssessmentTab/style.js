// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  section: css`
    background: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    margin-bottom: 15px;
  `,
  sectionHeader: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 26px 24px 15px;

    h2 {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
  `,
  loader: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: center;
  `,
  requestErrorText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    margin-bottom: 8px;
    text-align: center;
  `,
  dataGridTable: css`
    .rdg {
      border-width: 0px;
      --rdg-row-hover-background-color: ${colors.white};
    }

    .rdg-header-row {
      border-bottom: 2px solid ${colors.neutral_300};
    }

    .rdg-header-row {
      color: ${colors.grey_100};
      font-weight: 600;
      background: ${colors.white};
    }

    .rdg-cell {
      outline: none;
      border: none;
      color: ${colors.grey_200};
    }

    .mainValue {
      font-weight: 600;
      color: ${colors.grey_200};
    }
    .baselineSum {
      font-size: 11px;
      color: ${colors.grey_100};
    }

    .rdg-cell[role='columnheader'] {
      border-bottom: 2px solid ${colors.neutral_300};
      color: ${colors.grey_100};
    }

    .rdg-cell:nth-of-type(n + 3) {
      text-align: center;
      padding: 0px;
    }

    .rdg-cell:last-child {
      border-right: 2px solid ${colors.neutral_300};
    }
  `,
  dataGridTableBasic: css`
    .rdg-cell:nth-of-type(2) {
      border-left: 1px solid ${colors.neutral_300};
      border-right: 2px solid ${colors.neutral_300};
    }

    .rdg-cell:nth-of-type(-n + 2) {
      border-bottom: 1px solid ${colors.neutral_300};
    }
  `,
  dataGridTableSubRows: css`
    .rdg-cell:nth-of-type(3) {
      border-left: 1px solid ${colors.neutral_300};
      border-right: 2px solid ${colors.neutral_300};
    }

    .rdg-cell:nth-of-type(-n + 3) {
      border-bottom: 1px solid ${colors.neutral_300};
    }

    .rdg-row.DETAIL,
    .rdg-row.DETAIL_LAST,
    .rdg-row.DETAIL_FIRST {
      .rdg-cell:nth-of-type(1) {
        border-left: 2px solid ${colors.neutral_300};
      }

      .rdg-cell:nth-of-type(2) {
        span {
          padding-left: 16px;
        }
      }
    }

    .rdg-row.DETAIL_LAST {
      .rdg-cell {
        border-bottom: 2px solid ${colors.neutral_300};
      }
    }

    .rdg-row.DETAIL_FIRST {
      .rdg-cell {
        border-top: 2px solid ${colors.neutral_300};
      }
    }

    .rdg-row.orangeAlert {
      .rdg-cell:nth-of-type(n + 4) {
        background: ${colors.orange_50};
        color: ${colors.orange_200};
      }

      .rdg-cell > .belowOrEqualBaseline {
        background: ${colors.white};
        color: ${colors.grey_100};
      }
    }

    .rdg-row.redAlert {
      .rdg-cell {
        background: ${colors.red_50};
        color: ${colors.red_100};

        .mainValue.sectionValue {
          color: ${colors.red_100};
        }
      }
    }
  `,
};

export default style;
