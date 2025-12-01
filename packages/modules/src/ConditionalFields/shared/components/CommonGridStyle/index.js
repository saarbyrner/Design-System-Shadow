// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';
import { muiDataGridProps } from '@kitman/modules/src/PlanningEvent/src/components/AthletesSelectionTab/gameEventSelectionGridConfig';

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

    &#RulesetsGrid {
      tbody tr td:nth-of-type(5) {
        text-wrap: wrap;
      }
    }

    &#VersionsGrid {
      tbody tr td:nth-of-type(5) {
        text-wrap: wrap;
      }
    }

    &#AssigneesGrid {
      thead tr th:nth-of-type(3) {
        width: 100px;

        @media (min-width: ${breakPoints.tablet}) {
          padding-right: 100px;
        }

        @media (min-width: ${breakPoints.desktop}) {
          padding-right: 200px;
        }
      }
      tbody tr td:nth-of-type(3) {
        width: 100px;
        text-align: right;

        @media (min-width: ${breakPoints.tablet}) {
          padding-right: 100px;
        }

        @media (min-width: ${breakPoints.desktop}) {
          padding-right: 200px;
        }
      }
    }

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
        padding-right: 24px;
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
      .dataGrid__row {
        height: 40px;
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
  roundedImage: (size: number = 24) => css`
    width: ${size}px;
    height: ${size}px;
    object-fit: contain;
  `,
  avatarPlaceholder: (size: number = 24) => css`
    border-radius: 50%;
    background-color: ${colors.neutral_100};
    width: ${size}px;
    height: ${size}px;
    object-fit: contain;
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
  avatarCell: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  imageContainer: css`
    display: flex;
  `,
  linkCell: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  textCell: css`
    color: ${colors.grey_200};
    font-weight: 400;
    font-size: 14px;
  `,
  positionCell: css`
    color: ${colors.grey_300_50};
    font-size: 12px;
  `,
  centered: css`
    display: flex;
    justify-content: center;
  `,
  hasClick: css`
    cursor: pointer;
    color: ${colors.grey_300};
  `,
  prominent: css`
    font-weight: 600 !important;
  `,
  wrapText: css`
    white-space: wrap;
  `,
  icon: css`
    font-weight: 600;
    font-size: 17px;
    transform: scale(1, -1);
  `,
  iconCell: (color: string = colors.green_100) => css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    .textButton--kitmanDesignSystem .textButton__icon::before {
      font-size: 24px;
    }
    color: ${color};
  `,
  error: css`
    color: ${colors.red_100} !important;
    font-weight: 600;
  `,
  statusCell: css`
    width: fit-content;
    padding: 1px 8px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  draftStatus: css`
    background-color: ${colors.neutral_500_transparent_30};
  `,
  inactiveStatus: css`
    background-color: ${colors.red_100_20};
  `,
  activeStatus: css`
    background-color: ${colors.blue_100_10};
  `,
  statusIndicator: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
  `,
  draftStatusIndicator: css`
    background-color: transparent;
    border: 1px dashed ${colors.grey_100};
  `,
  inactiveStatusIndicator: css`
    background-color: ${colors.red_100};
  `,
  activeStatusIndicator: css`
    background-color: transparent;
    border: 1px solid ${colors.blue_100};
    border-right-style: dashed;
  `,
};

export const headerStyle = {
  headerCell: css`
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  headerCellCentered: css`
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: center;
  `,
};

export const statusStyle = {
  statusCell: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  chip: css`
    font-size: 14px;
    line-height: 20px;
    font-weigth: 400;
    padding: 1px 16px;
    border-radius: 30px;
    color: ${colors.grey_300};
    text-transform::first-letter: capitalize;
  `,
  incomplete: css`
    background: ${colors.neutral_200};
  `,
  rejected: css`
    background: ${colors.red_100_20};
  `,
  rejected_organisation: css`
    background: ${colors.red_100_20};
  `,
  rejected_association: css`
    background: ${colors.red_100_20};
  `,
  pending: css`
    background: ${colors.yellow_200};
  `,
  pending_organisation: css`
    background: ${colors.yellow_200};
  `,
  pending_association: css`
    background: ${colors.yellow_200};
  `,
  pending_payment: css`
    background: ${colors.yellow_200};
  `,
  approved: css`
    background: ${colors.green_100_20};
  `,
  tooltip: css`
    padding: 3px;
  `,
  tooltipTitle: css`
    font-size: 14px;
    font-weight: 600;
    text-transform: capitalize;
  `,
};

export const invalidStyle = {
  cell: css`
    display: flex;
    flex-direction: row;
    color: ${colors.red_100} !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    gap: 4px;
    cursor: pointer;
  `,

  tooltip: css`
    padding: 3px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  tooltipTitle: css`
    font-size: 14px;
    font-weight: 600;
    text-transform: capitalize;
  `,
};

export const filtersStyle = {
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

export const MUI_DATAGRID_OVERRIDES = {
  ...muiDataGridProps,
};
