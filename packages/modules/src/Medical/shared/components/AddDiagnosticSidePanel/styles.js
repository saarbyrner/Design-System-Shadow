// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

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
  logOrderButton: css`
    grid-column: span 2;
  `,
  laterality: css`
    margin-top: 16px;
  `,
  content: css`
    display: grid;
    column-gap: 8px;
    flex: 1;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
  `,
  type: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  player: css`
    grid-row: 1;
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  dateOfDiagnostic: css`
    display: grid;
    grid-row: 1;
    grid-template-columns: 0.5fr;
    margin-bottom: 16px;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `,
  prescriber: css`
    grid-row: 2;
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  referringPhysician: css`
    grid-row: 2;
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  link: css`
    grid-column: 1 / 3;
  `,
  visibility: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 3;
    margin: 16px 0;
    opacity: 0.5;
  `,
  medicationContainer: css`
    grid-row: 7;
    grid-column: span 2;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  medicationDateContainer: css`
    grid-row: 4;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column: span 2;
    column-gap: 8px;
  `,
  medicationType: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  medicationDosage: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  medicationFrequency: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  medicationCourseCompleted: css`
    grid-column: 2 / 2;
    margin: 30px 0px 16px;

    .reactCheckbox__label {
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      width: 100%;
    }
  `,
  startDate: css`
    grid-column: 1;
  `,
  endDate: css`
    grid-column: 3;
  `,
  covidContainer: css`
    display: grid;
    grid-template-columns: 1fr, 1fr;
    column-gap: 8px;
  `,
  covidTestDate: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  covidTestType: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  covidTestResult: css`
    grid-column: 1 / 2;
  `,
  covidTestReference: css`
    grid-column: 2 / 2;
  `,
  note: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
    margin-top: 8px;
  `,
  noteVisibility: css`
    grid-column: 1 / 2;
  `,
  multiBillingTopRow: css`
    grid-column: span 3;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr 0.1fr;
  `,
  multiBillingContainer: css`
    grid-column: span 2;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  billingContainer: css`
    grid-row: 11;
    grid-column: span 2;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  cptCode: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
  `,
  billableToggle: css`
    align-self: center;
    grid-column: 2 / span 1;
    margin-bottom: 16px;
    margin-top: 20px;
  `,
  addAnother: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
    margin-top: 20px;
    color: ${colors.grey_200};
  `,
  removeMultiCPT: css`
    grid-column: 4 / span 1;
    margin-bottom: 16px;
    margin-top: 20px;
    color: ${colors.grey_200};
  `,
  amountCharged: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
  `,
  discountOrReduction: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
  `,
  amountPaidInsurance: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
  `,
  amountDue: css`
    grid-column: 1 / span 1;
    margin-bottom: 16px;
  `,
  amountPaidAthlete: css`
    grid-column: 2 / span 1;
    margin-bottom: 16px;
  `,
  datePaidDate: css`
    grid-column: 3 / span 1;
    margin-bottom: 16px;
  `,
  billingContainerNoExtraFields: css`
    grid-column: span 3;
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr;
  `,
  amountPaidInsuranceNoExtraFields: css`
    grid-column: 1 / span 1;
  `,
  amountPaidAthleteNoExtraFields: css`
    grid-column: 2 / span 1;
  `,
  fileAttachmentContainer: css`
    grid-column: 1 / span 2;
    margin-bottom: 16px;
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
  attachments: css`
    grid-column: 1 / 2;
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
  contentIteration2: css`
    display: grid;
    column-gap: 8px;
    flex: 1;
    grid-template-columns: 50% 50%;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow-x: hidden;
    overflow-y: auto;
  `,
  attachmentsIteration2: css`
    grid-row: 14;
    grid-column: 1 / 2;
    margin-top: 16px;
  `,
  redoxReasonIssueContainer: css`
    column-gap: 8px;
    display: grid;
    grid-column: span 2;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  redoxLinkedIssue: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column: 2 / span 2;
    .kitmanReactSelect {
      grid-column: 1 / 3;
    }
  `,
  redoxReason: css`
    grid-column: 1 / span 1;
  `,
  redoxTypeBodyAreaContainer: css`
    column-gap: 8px;
    display: grid;
    grid-column: span 2;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  redoxType: css`
    display: grid;
    grid-column: 1 / span 2;
    width: initial;
    grid-template-columns:
      1fr 1fr
      .kitmanReactSelect {
      grid-column: 1;
    }
    .kitmanReactSelect__menu-list--with-search {
      overflow-y: hidden;
      z-index: 2147483014;
    }
  `,
  redoxBodyArea: css`
    grid-column: 3 / span 1;
  `,
  linkIteration2: css`
    grid-row: 6;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column: 1 / 3;
    margin-top: 8px;
    .kitmanReactSelect {
      grid-column: 1 / 3;
    }
  `,

  location: css`
    grid-row: 3;
    width: 100%;
    margin-bottom: 8px;
  `,
  typeReasonContainer: css`
    grid-row: 4;
    column-gap: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `,
  typeIteration2: css`
    grid-row: 5;
    display: grid;
    width: initial;
    grid-template-columns:
      1fr 1fr
      .kitmanReactSelect {
      grid-column: 1;
    }
    .kitmanReactSelect__menu-list--with-search {
      overflow-y: hidden;
      z-index: 2147483014;
    }
  `,

  reason: css`
    grid-row: 5;
    grid-column: 2;
  `,
  rowFour: css`
    grid-row: 4;
  `,
  linkContainer: css`
    display: grid;
    grid-column: span 2;
    grid-row: 10;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 0.2fr;
    margin-top: 16px;
  `,
  linksHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    h3 {
      font-size: 18px;
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  linkUri: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  linkTitle: css`
    grid-column: 1 / 1;
    margin-bottom: 16px;
  `,
  linkAddButton: css`
    grid-column: 3/3;
    margin: 16px 0px;
    padding-top: 8px;
  `,
  linkRender: css`
    background-color: ${colors.neutral_100};
    border-color: ${colors.neutral_100};
    align-items: center;
    color: ${colors.grey_200};
    display: flex;
    margin-bottom: 8px;
  `,
  span2: css`
    grid-column: span 2;
  `,
  span3: css`
    grid-column: span 3;
  `,
  attachmentLink: css`
    color: ${colors.grey_200};
    font-weight: 400;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
  PrescriberDateContainer: css`
    display: grid;
    grid-template-columns: 0.5fr 0.25fr 0.25fr;
    column-gap: 8px;
    align-items: center;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  `,
  multiPrescriber: css`
    grid-column: 1;
  `,
  multiDateOfDiagnostic: css`
    grid-column: 2;
  `,
  buttons: css`
    display: flex;
    gap: 8px;
  `,
  setForAllButton: css`
    grid-column: 4;
    justify-self: center;
    align-self: end;
  `,
  redoxTypeAppointmentDateContainer: css`
    margin: 8px 0px;
    column-gap: 8px;
    display: grid;
    grid-template-columns:
      1fr
      @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
  multiRedoxType: css`
    display: grid;
    grid-column: 1;
    width: initial;
    grid-template-columns:
      1fr 1fr
      .kitmanReactSelect {
      grid-column: 1;
    }
    .kitmanReactSelect__menu-list--with-search {
      overflow-y: hidden;
    }
  `,
  multiDateOfAppointment: css`
    grid-column: 3 / span 1;
  `,
  fixedVisibilityContainer: css`
    padding: 1.5rem;
  `,
  cardiacSegment: css`
    grid-column: span 2;
    margin-bottom: 16px;
    display: inline-flex;
    width: 100%;
    align-items: end;

    .datePicker {
      flex: 1;
    }
  `,
  askOnEntryQuestionsContainer: css`
    column-gap: 8px;
    display: grid;
    grid-column: span 2;
    grid-template-columns: 1fr 1fr;
  `,
  askOnEntryQuestion: css`
    grid-column: 1;
    padding: 4px 0;
  `,
  askOnEntryOptionalText: css`
    grid-column: 2;
    padding: 4px 0;
  `,
  questionWithOptionalTextContainer: css`
    column-gap: 8px;
    display: grid;
    grid-column: span 2;
    grid-template-columns: 1fr 1fr;
  `,
  multiOrderBodyAreaLateralityContainer: css`
    column-gap: 8px;
    display: grid;
    grid-column: span 2;
    grid-template-columns: 1fr 1fr;
  `,
  multiRedoxBodyArea: css`
    grid-column: 1;
  `,
  multiPlayerOrLocationContainer: css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 2px 0px;
  `,
  multiLocation: css`
    grid-column: span 2;
  `,
  multiPlayer: css`
    grid-column: span 2;
  `,
  gridColumn1: css`
    grid-column: 1;
  `,
  gridColumn2: css`
    grid-column: 2;
  `,
  gridColumn3: css`
    grid-column: 3;
  `,
  gridRow1: css`
    grid-row: 1;
  `,
  gridRow2: css`
    grid-row: 2;
  `,
  gridRow3: css`
    grid-row: 3;
  `,
  gridRow4: css`
    grid-row: 4;
  `,
  gridRow5: css`
    grid-row: 5;
  `,
  gridRow6: css`
    grid-row: 6;
  `,
  gridRow7: css`
    grid-row: 7;
  `,
  gridRow8: css`
    grid-row: 8;
  `,
  gridRow9: css`
    grid-row: 9;
  `,
  gridRow10: css`
    grid-row: 10;
  `,
  gridRow11: css`
    grid-row: 11;
  `,
  gridRow12: css`
    grid-row: 12;
  `,
  gridRow13: css`
    grid-row: 13;
  `,
  gridRow14: css`
    grid-row: 14;
  `,
};
