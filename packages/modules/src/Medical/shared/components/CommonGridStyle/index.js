// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

export const gridStyle = {
  wrapper: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
  `,
  grid: css`
    padding: 0;
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
    }
  `,
};

export const cellStyle = {
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,
  header: css`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    padding: 24px 24px 32px 24px;
    gap: 8px;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  squads: css`
    margin-right: 4px;
  `,
  athleteAllergies: css`
    display: flex;
    flex-direction: column;
  `,
  athleteAllergy: css`
    margin-bottom: 4px;
  `,
};

export const headerStyle = {
  headerCell: css`
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  athleteCell: css`
    display: flex;
    width: 180px;
  `,
  organisationWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  organisationCell: css`
    display: flex;
    align-items: center;
    padding-top: 8px;
    img {
      height: 20px !important;
      width: 20px !important;
    }
  `,
  departedDateCell: css`
    font-size: 14px;
    align-items: center;
    padding-top: 8px;
  `,
  imageContainer: css`
    display: flex;
  `,
  detailsContainer: css`
    display: flex;
    flex-direction: row;
    margin-left: 12px;
    align-items: center;
  `,
  defaultCell: css`
    display: block;
    width: 250px;
    overflow-wrap: normal;
    white-space: normal;
  `,
  availabilityMarker: css`
    align-items: center;
    border: 2px solid ${colors.p06};
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-left: 28px;
    margin-top: 28px;
    position: absolute;

    span {
      border-radius: 10px;
      display: block;
      height: 8px;
      width: 8px;
    }
  `,
  availabilityMarker__available: css`
    background-color: ${colors.green_200};
  `,
  availabilityMarker__injured: css`
    background-color: ${colors.orange_100};
  `,
  availabilityMarker__unavailable: css`
    background-color: ${colors.red_100};
  `,
  availabilityMarker__returning: css`
    background-color: ${colors.yellow_100};
  `,
  availabilityStatus: css`
    margin-top: 2px;
    .availabilityLabel {
      font-size: 14px;
    }
  `,
  unavailableSince: css`
    font-size: 12px;
  `,
};

export const filtersStyle = {
  wrapper: css`
    display: flex;
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }

    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
    margin: 8px 0 0 0;
  `,
  'filters--desktop': css`
    gap: 5px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    gap: 5px;

    button {
      margin-bottom: 8px;
    }

    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }

    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
};
