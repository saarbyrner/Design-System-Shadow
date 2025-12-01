// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  athleteDetails: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 45px;
    width: 45px;
  `,
  athleteInfo: css`
    flex-direction: column;
    text-align: start;
  `,
  athleteName: css`
    font-size: 13px;
    font-weight: bold;
    margin: 0px 0px 4px;
  `,
  athletePosition: css`
    color: ${colors.grey_100};
    font-size: 12px;
    margin: 0;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  formsTable: css`
    padding-top: 8px;

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
  athleteCell: css`
    display: flex;
    width: 280px;
  `,
  imageContainer: css`
    display: flex;
    align-items: center;
  `,
  image: css`
    border-radius: 20px;
    height: 30px;
  `,
  detailsContainer: css`
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  `,
};

export default style;
