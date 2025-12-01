// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    margin-bottom: 16px;
  `,
  availabilitySection: css`
    padding-bottom: 16px;
    padding-top: 16px;
    margin-bottom: 16px;
    margin-top: 16px;
    border-bottom: 1px solid ${colors.neutral_300};

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
  `,
  playerLeftClubSection: css`
    display: flex;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    justify-content: center;
  `,
  availabilityDetails: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    padding-left: 24px;
    position: relative;
    margin-top: 16px;
    margin-bottom: 0;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e8eaed;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }

    li {
      line-height: 16px;
    }
  `,
  detailLabel: css`
    font-weight: 600;
  `,
  statusDaterange: css`
    grid-column: 1 / 3;
  `,
  statusOrder: css`
    position: absolute;
    left: 0;
    color: ${colors.grey_100};
    font-size: 20px;
    font-weight: 600;
  `,
  statusList: css`
    color: ${colors.grey_200};
    padding: 0;
    margin-bottom: 0;
    list-style: none;

    > li {
      border-bottom: 1px solid ${colors.neutral_300};
      padding-bottom: 16px;

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }
  `,
  availabilitySummary: css`
    padding: 0;
  `,
  preliminaryStatusSection: css`
    margin-bottom: 16px;
  `,
  preliminaryStatusHeading: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
  preliminaryStatusList: css`
    margin-bottom: 0;
  `,
  currentStatusHeaderSection: css`
    display: flex;
    justify-content: space-between;
    button {
      background-color: none;
      margin-top: -5px;
      .textButton__icon::before {
        font-size: 20px;
      }
    }
  `,
};
