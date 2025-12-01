// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  sidePanel: css`
    .slidingPanel {
      display: flex;
      flex-direction: column;
    }

    .slidingPanel__heading {
      min-height: 80px;
      max-height: 80px;
    }

    .slidingPanel__heading {
      margin-bottom: 0;
    }
  `,
  date: {
    startDate: css`
      grid-column: 1 / span 3;
      margin-bottom: 16px;
      .timePicker__label {
        line-height: 20px;
      }
    `,
    startTime: css`
      grid-column: 4 / span 3;
      margin-bottom: 16px;
      .timePicker__label {
        line-height: 20px;
      }
    `,
    endDate: css`
      grid-column: 1 / span 3;
      margin-bottom: 16px;
      .timePicker__label {
        line-height: 20px;
      }
    `,
    endTime: css`
      grid-column: 4 / span 3;
      margin-bottom: 16px;
      .timePicker__label {
        line-height: 20px;
      }
    `,
    duration: css`
      grid-column: 1 / span 3;
      margin-bottom: 16px;
    `,
  },
  content: css`
    display: grid;
    column-gap: 8px;
    flex: 1;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
  `,
  debug: css`
    grid-column: 1 / span 6;
    margin-bottom: 16px;
    word-break: break-word;
    padding: 16px;
  `,
  player: css`
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  practitionerNoReferring: css`
    grid-column: 4 / span 3;
    margin-bottom: 16px;
  `,
  practitioner: css`
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  referringPhysician: css`
    grid-column: 4 / span 3;
    margin-bottom: 16px;
  `,
  dateOfTreatment: css`
    grid-column: 1 / span 2;
    margin-bottom: 16px;
  `,
  startTime: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
    width: 125px;

    .timePicker__label {
      line-height: 20px;
    }
  `,
  endTime: css`
    grid-column: 4 / span 1;
    margin-bottom: 16px;
    width: 125px;

    .timePicker__label {
      line-height: 20px;
    }
  `,
  endTimeErrorMessage: css`
    color: ${colors.red_100};
    margin-top: 2px;
    position: absolute;
  `,
  endTimeWarningMessage: css`
    color: ${colors.orange_200};
    margin-top: 2px;
    position: absolute;
  `,
  timezone: css`
    grid-column: 5 / span 2;
    margin-bottom: 16px;
  `,
  treatmentTitle: css`
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  duration: css`
    grid-column: 4 / span 1;
    margin-bottom: 16px;
  `,
  label: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    margin-right: 24px;
  `,
  durationValue: css`
    display: flex;
  `,
  treatment: css`
    display: contents;
  `,
  addTreatmentsTitle: css`
    color: ${colors.grey_200};
    font-size: 16px;
    font-weight: 600;
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  treatmentInfoTitle: css`
    color: ${colors.grey_200};
    font-size: 16px;
    font-weight: 600;
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  removeTreatment: css`
    grid-column: 6 / span 1;
    justify-self: end;
  `,
  treatmentModality: css`
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  treatmentBodyArea: css`
    grid-column: 4 / span 3;
    margin-bottom: 16px;
  `,
  treatmentReason: css`
    grid-column: 1 / span 3;
    margin-bottom: 16px;
  `,
  treatmentDuration: css`
    grid-column: 4 / span 1;
    margin-bottom: 16px;
  `,
  billingContainer: css`
    grid-column: span 6;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  cptCode: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
  `,
  icdCode: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
  `,
  billableToggle: css`
    align-self: center;
    grid-column: 3 / span 1;
    margin-bottom: 16px;
    margin-top: 20px;
  `,
  amountCharged: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  discountOrReduction: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  amountPaidInsurance: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  amountDue: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  amountPaidAthlete: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  datePaidDate: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
    max-width: 198px;
  `,
  amountsNoExtraFieldsContainer: css`
    grid-column: span 6;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr;
  `,
  amountPaidInsuranceNoExtraFields: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
  `,
  amountPaidAthleteNoExtraFields: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
  `,
  treatmentComment: css`
    grid-column: 1 / span 6;

    .textarea__input--kitmanDesignSystem {
      min-height: 32px;
    }
  `,
  treatmentNote: css`
    grid-column: 1 / span 6;
  `,
  addTreatment: css`
    grid-column: 1 / span 1;
  `,
  attachmentsHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;

    h3 {
      font-size: 18px;
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  attachmentContainer: css`
    grid-column: 1 / span 6;
    margin-bottom: 16px;
  `,
  attachments: css`
    grid-column: 1 / 2;
  `,
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / span 6;
    margin: 16px 0;
    opacity: 0.5;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
  `,
  treatment_location: css`
    grid-column: 1 / 4;
    margin-bottom: 16px;
  `,
};
