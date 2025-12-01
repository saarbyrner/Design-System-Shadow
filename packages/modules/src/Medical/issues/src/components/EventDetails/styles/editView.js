// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  viewWrapper: css`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px 8px;
  `,
  issueDate: css`
    grid-column: 1 / 5;
  `,
  event: css`
    grid-column: 1 / 7;
  `,
  mechanismDescription: css`
    grid-column: 1 / 10;
  `,
  sessionStatus: css`
    grid-column: 10 / 12;
    align-self: flex-end;
  `,
  presentationType: css`
    grid-column: 1 / 4;
  `,
  description: css`
    display: flex;
    align-items: baseline;

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
  freeTextSelections: css`
    grid-column: 1 / 5;
  `,
  freeTextValues: css`
    grid-column: 5 / 9;
  `,
  freeTextSelectionsLong: css`
    grid-column: 1 / 7;
  `,
  freeTextValuesLong: css`
    grid-column: 7 / 13;
  `,
  injuryTime: css`
    .timePicker__kitmanDesignSystem .timePicker__label {
      line-height: 20px;
    }
  `,
};

const editConditionalStyles = (freetextPresent: boolean) => ({
  freetextPresent: css`
    grid-column: ${freetextPresent ? '9 / 14' : '5 / 9'};
  `,
});

export { editConditionalStyles };
