// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const getStyles = () => ({
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    margin-bottom: 8px;
    flex-direction: column;
  `,
  header: css`
    border-bottom: 0.5px solid ${colors.neutral_300};
    display: flex;
    padding: 24px;
    flex-direction: row;
  `,
  treatmentAppointment: css`
    display: flex;
    flex-direction: column;
    text-align: left;
    flex-grow: 1;
    gap: 12px;
  `,
  athleteDetails: css`
    display: flex;
    align-items: center;
    img {
      margin-right: 8px;
    }
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 32px;
    width: 32px;
  `,
  athleteInfoContainer: css`
    display: flex;
    flex-direction: column;
  `,
  actions: css`
    display: flex;
    gap: 5px;
  `,
  treatmentDate: css`
    font-size: 18px;
    font-weight: 600;
    color: ${colors.grey_300};
    line-height: 22px;
  `,
  treatmentPractitioner: css`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.grey_200};
    line-height: 16px;
  `,
  treatmentTable: css`
    padding: 24px;
    .dataTable__thead {
      background: white;
      border-top: 1px solid ${colors.neutral_300};
    }
    .dataTable__th,
    .dataTable__td {
      background: ${colors.white};
      &:first-of-type {
        box-shadow: 4px 0px 3px ${colors.neutral_300};
      }
    }
  `,
  treatmentCardFooter: css`
    display: grid;
    grid-template-columns: 1fr;
    border-top: 0.5px solid ${colors.neutral_300};
    padding: 24px 0;
    @media (min-width: ${breakPoints.desktop}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
  treatmentNote: css`
    display: flex;
    padding: 0 24px;
    flex-direction: column;
    min-width: 60%;
    font-size: 14px;
    font-weight: 400;
    color: ${colors.grey_200};
    border-right: 1px solid ${colors.neutral_300};
  `,
  treatmentAttachments: css`
    display: flex;
    flex-direction: column;
    min-width: 40%;
    width: 100%;
    padding: 0 24px;
  `,
  sectionTitle: css`
    font-size: 12px;
    font-weight: 600;
    color: ${colors.grey_100};
    line-height: 16px;
    margin-bottom: 12px;
  `,

  attachmentIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  attachmentCreated: css`
    font-weight: 400;
    color: ${colors.grey_200};
    font-size: 14px;
    margin-top: 8px;
  `,
  attachmentLink: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 600;
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
  attachmentsList: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 1rem;
    max-height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
  `,
  attachmentItem: css`
    box-sizing: border-box;
    width: 240px;
    flex-shrink: 0;
  `,
  isBillableSelect: css`
    width: 100%;
  `,
  createdAtDate: css`
    margin-top: 1em;
    display: block;
    font-size: 11px;
    text-align: left;
  `,
});

export default getStyles;
