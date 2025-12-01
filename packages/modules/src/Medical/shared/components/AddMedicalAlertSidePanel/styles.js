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
  gridRow4: css`
    grid-row: 2;
  `,
  heading: css`
    color: ${colors.grey_200};
    font-size: 18px;
    margin-bottom: 20px;
    border-top: 1px solid ${colors.neutral_300};
    padding-top: 15px;
  `,
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 3;
    margin: 16px 0;
    opacity: 0.5;
  `,
  alertSubHeader: css`
    color: ${colors.grey_200};
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    grid-row: 3;
  `,
  alertSelect: css`
    grid-column: 1 / 3;
  `,
  asyncSelect: css`
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
  custom_alert_name: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,

  severity_selector: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
  `,
  severity_label: css`
    grid-column: 1 / 3;
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
