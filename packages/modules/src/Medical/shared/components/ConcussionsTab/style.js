// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  wrapper: css`
    padding-bottom: 20px;
  `,
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
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
  expiredDate: css`
    color: ${colors.red_200};
  `,
  expiryingDate: css`
    color: ${colors.orange_300};
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
  noFormsText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
  concussionsList: css`
    overflow-y: auto;
  `,
  concussionsListEmpty: css`
    height: auto;
  `,
  athleteCell: css`
    display: flex;
    width: 280px;
  `,
  athleteRosterCell: css`
    display: flex;
    width: 280px;
    padding-top: 4px;
    line-height: 1.5em;
  `,
  imageContainer: css`
    display: flex;
    align-items: center;
  `,
  detailsContainer: css`
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  `,
  position: css`
    color: ${colors.grey_100};
    font-size: 12px;
  `,
  statusPill: css`
    border-radius: 25px;
    padding: 2px 4px 4px 4px;
    font-size: 12px;
  `,
  expired: css`
    background: ${colors.red_50};
    color: ${colors.red_200};
  `,
  expiring: css`
    background: ${colors.orange_50};
    color: ${colors.orange_300};
  `,
  outstanding: css`
    background: ${colors.red_200};
    color: ${colors.white};
  `,
  greyBackground: css`
    background: ${colors.neutral_200};
  `,
  tableLoading: css`
    margin-top: 20px;
    height: 40px;
    text-align: center;
  `,
  formsTable: css`
    .rdg {
      border-width: 0px;
      --rdg-row-hover-background-color: ${colors.white};
    }

    .rdg-header-row {
      color: ${colors.grey_100};
      font-weight: 600;
      background: ${colors.white};
      border-bottom: 2px solid ${colors.neutral_300};
    }

    .rdg-cell {
      outline: none;
      border: none;
      border-bottom: 1px solid ${colors.neutral_300};
      color: ${colors.grey_200};
    }

    .rdg-cell[role='columnheader'] {
      border-bottom: 2px solid ${colors.neutral_300};
      color: ${colors.grey_100};
    }

    .rdg-cell[role='columnheader']:first-of-type {
      padding-left: 25px;
    }

    .rdg-cell[role='gridcell']:first-of-type {
      padding-left: 25px;
    }
  `,
};

export default style;
