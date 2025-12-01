// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyles = () => ({
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,

  athleteDetails: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  athleteAvatar: css`
    border-radius: 50%;
    height: 40px;
    width: 40px;
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

  content: css`
    background: ${colors.p06};
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${colors.neutral_300};
    border-right: 1px solid ${colors.neutral_300};
    border-bottom: 1px solid ${colors.neutral_300};
    /* border-radius: 3px; */
  `,

  header: css`
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: ${colors.grey_300};
    padding: 24px 24px 0px 24px;
  `,

  loadingText: css`
    color: ${colors.neutral_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,

  MedicationCardListEmpty: css`
    height: auto;
  `,

  medicationsTable: css`
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
    }
    .dataTable__td--medication_display {
      padding-left: 0;
    }
  `,

  medicationText: css`
    font-size: 60px;
  `,

  noMedicationsText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,

  severity: css`
    display: flex;
    span {
      font-size: 14px;
      text-transform: capitalize;
    }
  `,
  alignLeft: css`
    text-align: left;
    padding-bottom: 7px;
  `,
});

export default getStyles;
