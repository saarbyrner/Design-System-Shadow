// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  content: css`
    display: grid;
    column-gap: 8px;
    flex: 1;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
  `,
  player: css`
    grid-row: 1;
    grid-column: 1 / 2;
    margin-bottom: 8px;
  `,
  dateOfProcedure: css`
    display: grid;
    grid-row: 4;
    grid-template-columns: 0.5fr;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `,
  actions: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    height: 80px;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
  `,
  location: css`
    grid-row: 3;
    width: 100%;
  `,
  note: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
    margin-top: 8px;
  `,
  proceduresContainer: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 8px;
  `,
  procedureDates: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 8px;
    margin-bottom: 16px;

    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-column: span 3;
    }
  `,
  procedure: css`
    grid-column: span 2;
    grid-row: 5;
    width: 100%;
    margin-bottom: 16px;

    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 0.6fr 0.4fr;
    }
  `,
  procedureDescription: css`
    grid-row: 5;
    width: 100%;
    margin-bottom: 16px;
  `,
  provider: css`
    grid-row: 4;
    width: 100%;
    margin-bottom: 16px;
  `,
  procedureReason: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  procedureReasonOther: css`
    grid-column: span 2;
  `,
  complications: css`
    display: grid;
    grid-template-columns: 50% 0.8fr 0.2fr;
    grid-column-gap: 8px;
  `,
  complicationAddButton: css`
    align-self: center;
  `,
  complicationClearButton: css`
    align-self: end;
    justify-self: end;
    grid-column: 3 / 4;

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  bodyArea: css`
    margin-bottom: 16px;
  `,
  associatedIssues: css`
    margin-bottom: 16px;
    grid-column: span 3;
  `,
  timing: css`
    grid-column: span 3;
    grid-column-gap: 8px;
    display: grid;
    margin-bottom: 16px;
    grid-template-rows: 3;
    grid-template-columns: 1fr 1fr;
  `,
  timingRow2: css`
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 8px;

    .timePicker__label {
      margin-bottom: 8px;
    }
  `,
  timingRow3: css`
    grid-row: 14;
    grid-column: span 3;
    grid-template-columns: 0.7fr 0.7fr 1fr;
    display: grid;
    grid-gap: 9px;
    margin-top: 16px;
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
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 3;
    margin: 16px 0;
    opacity: 0.5;
  `,
  span1: css`
    grid-column: span 1;
  `,
  span2: css`
    grid-column: span 2;
  `,
  span3: css`
    grid-column: span 3;
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
  gridRow15: css`
    grid-row: 15;
  `,
  gridRow16: css`
    grid-row: 16;
  `,
  gridRow17: css`
    grid-row: 17;
  `,
  gridRow18: css`
    grid-row: 18;
  `,
  gridRow19: css`
    grid-row: 19;
  `,
  gridRow20: css`
    grid-row: 20;
  `,
  gridRow21: css`
    grid-row: 21;
  `,
  gridRow22: css`
    grid-row: 22;
  `,
  marginTopNone: css`
    margin-top: 0;
  `,
  marginTopMulti: css`
    margin-top: 16px;
    padding-top: 10px;
    border-top: 1px solid ${colors.neutral_300};
  `,
  setForAllButton: css`
    grid-column: 4;
    justify-self: center;
    align-self: end;
  `,
  buttonContainer: css`
    display: flex;
    gap: 4px;
  `,
  addAnotherProcedureButton: css`
    margin-top: 12px;
  `,
};
