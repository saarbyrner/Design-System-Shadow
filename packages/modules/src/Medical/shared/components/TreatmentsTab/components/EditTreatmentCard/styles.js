// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const labelStyles = css`
  display: block;
  flex: 1;
  color: ${colors.grey_100};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  margin-top: 8px;
`;

const getStyles = () => ({
  editTreatmentContent: css`
    background: ${colors.p06};
    border-radius: 3px;
    border: 1px solid ${colors.neutral_300};
    column-gap: 8px;
    display: grid;
    flex-direction: column;
    flex: 1;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(12, 1fr);
    margin-bottom: 8px;
    overflow: auto;
    padding: 24px;
  `,
  loadingText: css`
    color: ${colors.neutral_300};
    font-size: 14px;
    font-weight: normal;
    grid-column: 6 / span 2;
    line-height: 20px;
    margin: auto;
    text-align: center;
  `,
  editAthleteDetails: css`
    display: flex;
    grid-column: 1 / span 2;
    img {
      margin-right: 12px;
    }
    margin: 10px 22px 0 0;
  `,
  editAthleteAvatar: css`
    border-radius: 50%;
    height: 40px;
    width: 40px;
  `,
  athleteInfoContainer: css`
    display: flex;
    flex-direction: column;
    overflow: auto;
  `,
  editAthleteName: css`
    color: ${colors.grey_300};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  editAthletePosition: css`
    color: ${colors.grey_300};
    font-size: 12px;
  `,
  editTreatmentDate: css`
    color: ${colors.grey_300};
    font-size: 18px;
    grid-column: 3 / span 2;
    font-weight: 600;
    line-height: 22px;
    margin-right: 8px;

    .inputText--kitmanDesignSystem label {
      line-height: 20px;
    }
  `,
  treatmentPractitioner: css`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.grey_200};
    line-height: 16px;
  `,
  editTreatmentPractitioner: css`
    grid-column: 5 / span 2;
    margin-right: 8px;
  `,
  editStartTime: css`
    grid-column: 7 / span 1;
    margin-right: 8px;
    min-width: 125px;

    .timePicker__label {
      line-height: 20px;
    }
  `,
  editEndTime: css`
    grid-column: 8 / span 1;
    margin-right: 8px;
    min-width: 125px;

    .timePicker__label {
      line-height: 20px;
    }
  `,
  editTimezone: css`
    grid-column: 9 / span 2;
    margin-right: 8px;
  `,
  removeAthlete: css`
    align-items: end;
    display: flex;
    flex-direction: column;
    grid-column: 12 / span 1;

    .iconButton {
      color: ${colors.grey_200};
    }
  `,
  editTreatmentNote: css`
    grid-column: 1 / span 6;
    margin-top: 8px;

    .textarea__input--kitmanDesignSystem {
      min-height: 32px;
    }
  `,
  endTimeErrorMessage: css`
    color: ${colors.red_100};
    grid-column: 8 / span 3;
    margin-top: 8px;
  `,
  endTimeWarningMessage: css`
    color: ${colors.orange_200};
    grid-column: 8 / span 3;
    margin-top: 8px;
  `,
  editTreatmentModalityLabel: css`
    grid-column: 1 / span 2;
    ${labelStyles}
  `,
  editTreatmentReasonLabel: css`
    grid-column: 3 / span 2;
    ${labelStyles}
  `,
  editTreatmentBodyAreaLabel: css`
    grid-column: 5 / span 2;
    ${labelStyles}
  `,
  editTreatmentDurationLabel: css`
    grid-column: 7 / span 1;
    ${labelStyles}
  `,
  editTreatmentCommentLabel: css`
    grid-column: 8 / span 2;
    ${labelStyles}
  `,
  editTreatmentModality: css`
    grid-column: 1 / span 2;
    margin-bottom: 8px;
  `,
  editTreatmentReason: css`
    grid-column: 3 / span 2;
    margin-bottom: 8px;
  `,
  editTreatmentBodyAreas: css`
    grid-column: 5 / span 2;
    margin-bottom: 8px;
  `,
  editTreatmentDuration: css`
    grid-column: 7 / span 1;
    margin-bottom: 8px;
  `,
  editTreatmentComment: css`
    grid-column: 8 / span 4;
    margin-bottom: 8px;

    .textarea__label {
      display: none;
    }

    .textarea__input--kitmanDesignSystem {
      min-height: 32px;
    }
  `,
  removeTreatment: css`
    display: flex;
    flex-direction: column;
    grid-column: 12 / span 1;
    height: 32px;
    justify-content: center;
    width: 50px;

    .iconButton {
      color: ${colors.grey_200};
    }
  `,
  removeAllTreatmentsLabel: css`
    align-items: end;
    color: ${colors.blue_300};
    cursor: pointer;
    display: flex;
    grid-column: 12 / span 1;
    min-width: 82px;
    padding: 0 0 4px 18px;
    text-decoration: underline;
  `,
  addTreatment: css`
    grid-column: 1 / span 1;
  `,
});

export default getStyles;
