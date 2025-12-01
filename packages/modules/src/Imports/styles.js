// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  container: css`
    background: ${colors.white};
    margin: 16px 20px;

    .dataGrid {
      &__headLine {
        top: 15px;
      }
      &__cell {
        padding: 15px 25px;
      }
      &__loading {
        margin-bottom: 12px;
      }
    }

    td.dataGrid__cell,
    td.dataGrid__fillerCell {
      border-bottom: 1px solid ${colors.neutral_300};
    }
  `,
  header: css`
    padding: 25px 25px 0;
    display: flex;
    justify-content: space-between;

    h6 {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
  `,
  actionButtons: css`
    display: flex;
    gap: 8px;
  `,
  downloadLink: css`
    a {
      color: ${colors.grey_200};
      padding-left: 5px;
    }
  `,
  errorList: css`
    list-style: none;
    color: ${colors.red_100};
    max-height: 115px;
    overflow: auto;
    padding: 15px 25px;
    margin: 0;
  `,
  statusIndicator: css`
    display: inline-block;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: ${colors.white};
    padding: 2px 7px;
    border-radius: 30px;
  `,
  inProgressStatus: css`
    background: ${colors.orange_100};
  `,
  successStatus: css`
    background: ${colors.green_100};
  `,
  errorStatus: css`
    background: ${colors.red_100};
  `,
  expiredStatus: css`
    background: ${colors.cool_mid_grey};
  `,
};
