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
  content: css`
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
    flex: 1;
  `,
  player: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  date: css`
    grid-column: 2 / 3;
    margin-bottom: 16px;
  `,
  dateHeading: css`
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    justify-content: space-between;
    place-items: center;
  `,
  datePicker: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `,
  heading: css`
    color: ${colors.grey_200};
    font-size: 18px;
    margin-bottom: 20px;
    border-top: 1px solid ${colors.neutral_300};
    padding-top: 15px;
  `,
  allergyDetailsSection: css`
    grid-column: 1 / 3;
  `,
  allergySelect: css`
    grid-column: 2 / 3;
    padding-bottom: 16px;
    grid-row: 3;
  `,
  allergyTypeSelect: css`
    grid-column: 1 / 2;
    padding-bottom: 16px;
    grid-row: 3;
  `,
  allergyName: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  athleteIssues: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
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
  custom_allergy_name: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  symptoms: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${colors.neutral_300};

    textarea {
      height: 56px;
    }
  `,
  severity: css`
    grid-column: 1 / 3;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 16px;
  `,
  questions: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
    border-top: 1px solid ${colors.neutral_300};
    border-bottom: 1px solid ${colors.neutral_300};
  `,
  question: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
  `,
  extraDateOption: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
  `,
  visibility: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  noBorder: css`
    border: none;
  `,
};
