// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const getStyles = () => ({
  header: css`
    align-items: flex-start;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin-bottom: 8px;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  filters: css`
    display: flex;
    z-index: 4;
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
  'filter--daterange': css`
    @media (max-width: ${breakPoints.tablet}) {
      margin-bottom: 5px;
    }
    @media (max-width: ${breakPoints.desktop}) {
      margin-top: 0;
      width: 235px;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
  `,
  notesButtons: css`
    display: flex;
    gap: 5px;
  `,
  athleteCell: css`
    display: flex;
    width: 280px;
  `,
  imageContainer: css`
    display: flex;
  `,
  detailsContainer: css`
    display: flex;
    flex-direction: column;
    margin-left: 12px;
  `,
  position: css`
    color: ${colors.grey_100};
    font-size: 12px;
    text-align: left;
    padding-top: 6px;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
    position: sticky;
    right: 0;
  `,
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
  `,
  documentsTable: css`
    padding: 24px;
    .dataTable {
      overflow: auto;
    }
    .dataTable__thead {
      background: white;
    }
    .dataTable__th,
    .dataTable__td {
      background: ${colors.white};
      box-shadow: 4px 0px 3px ${colors.neutral_300};
    }
    .dataTable__td--actions {
      position: sticky;
      right: 0;
    }
  `,
  loadingText: css`
    color: ${colors.neutral_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
  attachmentLink: css`
    color: ${colors.grey_200};
    font-weight: 600;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_200};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
  link: css`
    display: flex;
    align-content: start;
    justify-content: start;
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
  `,
  note: css`
    display: flex;
    align-content: start;
    justify-content: start;
    text-align: left;
  `,
  noNoteText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
  fileTypeIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  checkbox: css`
    min-width: 28px;
  `,
});

export default getStyles;
