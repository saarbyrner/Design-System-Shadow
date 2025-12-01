// @flow
import { css } from '@emotion/react';
import { colors, shadows, breakPoints } from '@kitman/common/src/variables';

const style = () => {
  return {
    contentContainer: css`
      background-color: ${colors.p06};
      border-radius: 3px;
      box-shadow: ${shadows.section};
      height: min-content;
      @media (min-width: ${breakPoints.tablet}) {
        min-width: 491px;
      }

      padding: 24px 24px 16px;
    `,
    mainHeader: css`
      display: flex;
      align-items: end;
      justify-content: space-between;
      margin-bottom: 16px;
    `,
    buttonContainer: css`
      display: flex;
      align-items: end;
      justify-content: space-between;
      column-gap: 4px;
      margin-bottom: 4px;
    `,
    mainButtons: css`
      display: flex;
      align-items: end;
      justify-content: space-between;
      column-gap: 4px;
      margin-bottom: 4px;
    `,
    contactHeading: css`
      display: flex;
      align-items: end;
      justify-content: space-between;
      margin-bottom: 8px;
      max-width: 800px;
    `,
    emergencyContact: css`
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px 0px;
      margin-bottom: 24px;
      max-width: 800px;
    `,
    numbersGrid: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      max-width: 800px;

      @media (max-width: ${breakPoints.tablet}) {
        grid-template-columns: 1fr;
      }
    `,
    noContacts: css`
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    `,
    doubleRow: css`
      display: inline-flex;
      flex-direction: row;
      gap: 16px;

      @media (max-width: ${breakPoints.tablet}) {
        flex-direction: column;
      }

      > * {
        width: 100%;
      }
    `,

    singleColumn: css`
      display: inline-flex;
      flex-direction: column;
      gap: 16px;

      > * {
        width: 100%;
      }
    `,
    label: css`
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
      width: fit-content;
    `,
    labelOptional: css`
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 4px;
      float: right;
    `,
    phonePrefix: css`
      min-width: 70px;
      width: 240px;
      margin-right: 8px;
    `,
    phoneEntry: css`
      display: flex;
    `,
  };
};

export default style;
