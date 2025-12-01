// @flow
import { css } from '@emotion/react';

import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  main: css`
    display: flex;
    justify-content: space-between;
  `,
  detailsAdditionalInfo: css`
    display: grid;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 16px 0px;

    li {
      line-height: 16px;
    }
  `,
  authorDetails: css`
    font-size: 11px;
    color: ${colors.grey_200};
  `,
  details: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    margin-bottom: 8px;

    li {
      line-height: 16px;
      margin: 8px 8px 8px 0;
    }
  `,
  annotation: css`
    grid-template-columns: 1fr;
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  actions: css`
    display: flex;
    gap: 8px;
  `,
  editEndDate: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
  detailValue: css`
    color: ${colors.grey_200};
  `,
  detailsMain: css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
    margin-bottom: 30px;

    @media (max-width: ${breakPoints.tablet}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
  detailLabel: css`
    font-weight: 600;
    margin-right: 5px;
  `,
  procedureType: css`
    display: flex;
    grid-column: span 2;
  `,
  sectionHeading: css`
    font-weight: 600;
    font-size: 20px;
    line-height: 22px;
    color: ${colors.grey_300};
    margin-bottom: 22px;
  `,
  timing: css`
    display: inline-block;
    &:first-letter {
      text-transform: capitalize;
    }
  `,
  hr: css`
    border-top: 0;
    background-color: ${colors.neutral_300};
    height: 2px;
  `,
};
