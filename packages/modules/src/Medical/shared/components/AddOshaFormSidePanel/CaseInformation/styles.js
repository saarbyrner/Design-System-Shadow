// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  content: css`
    padding: 8px 24px 32px;
    flex: 1;
  `,
  sectionTitle: css`
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    grid-column: 1 / 4;
    color: ${colors.grey_200};
  `,
  initialForm: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    padding-top: 8px;
  `,
  leftColumnContainer: css`
    grid-column: 1 / 2;
    p {
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      margin: 0;
      position: absolute;
    }
    :first-of-type {
      margin-bottom: 16px;
    }
  `,
  rightColumnContainer: css`
    grid-column: 2 / 4;

    .timePicker {
      &__label {
        line-height: 20px;
      }
    }
  `,
  textAreaContainer: css`
    grid-column: 1 / 4;

    .textarea {
      &__label {
        flex-direction: column;
        span {
          font-size: 11px;
          line-height: 14px;
        }
      }

      &__input {
        height: 80px;
      }
    }
  `,
  noTimeEventContainer: css`
    grid-column: 1/3;
  `,
};
