// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  viewWrapper: css`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px 8px;
  `,
  pathologyType: css`
    grid-column: 1 / 4;
  `,
  pathology: css`
    grid-column: 4 / 9;
  `,
  addPathology: css`
    align-self: flex-end;
    grid-column: 9 / 13;

    button {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  `,
  classification: css`
    grid-column: 1 / 6;
  `,
  supplementalPathology: css`
    align-items: flex-end;
    display: flex;
    grid-column: 1 / 6;

    button {
      color: ${colors.grey_100};
      height: 19px;
      margin-bottom: 8px;
      min-width: 16px;
      &:hover {
        color: ${colors.grey_100};
      }
    }
  `,
  bodyArea: css`
    grid-column: 6 / 9;
  `,
  code: css`
    grid-column: 9 / 12;
    margin-top: 3px;
  `,
  tissueType: css`
    grid-column: 9 / 12;
    margin-top: 3px;
  `,
  bamicGrade: css`
    grid-column: 1 / 5;
  `,
  bamicSite: css`
    grid-column: 5 / 10;
  `,
  examinationDate: css`
    grid-column: 1 / 5;
  `,
  onset: css`
    grid-column: 1 / 5;
  `,
  onsetFreeText: css`
    grid-column: 5 / 10;
  `,
  onsetDescription: css`
    grid-column: 1 / 5;
  `,
  supplementaryCoding: css`
    grid-column: 1 / 5;
  `,
  side: css`
    grid-column: 1 / 8;
  `,
  concussion: css`
    grid-column: 1 / 8;
  `,
  description: css`
    align-items: baseline;
    display: flex;

    button {
      color: ${colors.grey_100};
      height: 16px;
      min-width: 16px;
      &:hover {
        color: ${colors.grey_100};
      }
      &::before {
        font-size: 16px;
      }
    }
  `,
  descriptionLabel: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    margin-right: 2px;
  `,
  descriptionValue: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  `,
  divider: css`
    grid-column: 1/13;
    border-top: solid 1px ${colors.neutral_300};
    width: 100%;
    margin: 0;
  `,
  secondaryPathology: css`
    grid-column: 1/6;
  `,
  secondaryPathologySide: css`
    margin-top: 4px;
    grid-column: 6/12;
  `,
  secondaryPathologyDetails: css`
    grid-column: 1/13;
    width: 100%;
    display: flex;

    & > * {
      flex: 1;
    }
  `,
  removeSecondaryPathology: css`
    margin-top: 16px;
    grid-column: 12/13;

    /* .iconButton {
      height: auto;
      margin-top: 4px;
    } */
  `,
  // removeSecondaryPathologyFirst: css`
  //   grid-column: 12/13;
  //   margin-top: 16px;
  // `,
  supplementalRecurrence: css`
    grid-column: 1/6;

    button {
      font-weight: 600;
      padding: 0;

      &:hover {
        background-color: transparent;
      }
    }
  `,
  textLabel: css`
    width: 77px;
    height: 16px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.grey_100};
    flex: none;
    order: 0;
    flex-grow: 0;
    margin-bottom: 0px;
  `,
  textValue: css`
    width: 137px;
    height: 20px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    align-items: center;
    color: ${colors.grey_200};
    flex: none;
    order: 0;
    flex-grow: 0;
  `,
  ciCodeBodyArea: css`
    grid-column: 1;
  `,
  ciCodeSide: css`
    grid-column: 4;
  `,
  ciCode: css`
    grid-column: 7;
  `,
  injuryFieldUpdate: css`
    grid-column: 1/4;

    div.linkedIssueIllness {
      border: solid ${colors.neutral_400};
      border-left: 4px solid ${colors.neutral_400};
      padding: 1.42em 0px 1.64em 20px;
    }
  `,
};
