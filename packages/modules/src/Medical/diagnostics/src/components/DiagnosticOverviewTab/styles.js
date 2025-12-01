// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  diagnosticOverviewTab: css`
    display: grid;
    grid-template-columns: 70% 1fr;
    grid-gap: 16px;

    @media only screen and (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 100%;
      grid-gap: 0;
    }
  `,
  mainContent: css`
    > section {
      margin-bottom: 16px;
    }
  `,
  sectionLoader: css`
    top: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  resultsSection: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
    h2,
    h3,
    h4,
    h5,
    p,
    span {
      color: ${colors.grey_300};
      font-family: Open Sans;
    }
    h2 {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      margin-right: 16px;
    }
    h4 {
      font-size: 16px;
      font-weight: 600;
      line-height: 18px;
      letter-spacing: 0px;
      text-align: left;
      margin-top: 24px;
    }
    h5 {
      font-size: 14px;
      font-weight: 600;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
    }
    /* Lab report table */
    .dataTable {
      overflow: auto;
    }
  `,
  resultsSectionHeader: css`
    display: flex;
    div.reactCheckbox span {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: left;
    }
    p {
      letter-spacing: 0px;
      text-align: left;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
    hr {
      background-color: 1px solid ${colors.neutral_300};
      margin: 8px 0;
      opacity: 0.5;
    }
  `,
  redoxDataBlock: css`
    margin-bottom: 40px;

    p {
      white-space: pre-line;
    }
  `,
  descriptionHeading: css`
    margin-bottom: 8px;
  `,
  findingsHeading: css`
    margin-bottom: 24px;
  `,
  mutlipleResultsHeading: css`
    padding-bottom: 8px;
  `,
  abnormalFlag: css`
    background-color: ${colors.yellow_200};
    padding: 12px;
    display: inline-block;
  `,
  resultCell: css`
    span {
      width: 100%;
      text-align: center;
    }
  `,
};
