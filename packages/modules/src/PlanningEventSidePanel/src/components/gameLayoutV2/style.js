// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  textArea: css`
    .textarea__input--kitmanDesignSystem {
      min-height: 84px;
    }
  `,
  addTopMargin: css`
    margin-top: 16px;
  `,
  addLinkInputs: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 8fr 1fr [end];
    margin-top: 16px;
  `,
  separator: css`
    grid-column: 1 / span end;
    border-top: 2px solid ${colors.neutral_300};
    margin-bottom: 16px;
  `,
  singleColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    margin-bottom: 16px;
  `,
  addTitleColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 8fr 1fr [end];
  `,
  fullWidthRow: css`
    grid-column: 1 / span end;
  `,
  halfWidthRow: css`
    grid-column: auto / span 1;
  `,
  additionalDetailsColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr [end];
  `,
  eventDateTime: css`
    display: grid;
    gap: 16px;
    grid-template-columns: 1.3fr 2.2fr 1fr;
  `,
  date: css`
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
  `,
  startTime: css`
    grid-row: 2 / 3;
    .timePicker__label {
      line-height: 20px;
    }
  `,
  timezone: css`
    grid-row: 2 / 3;
    line-height: 16px;
    .kitmanReactSelect__menu {
      position: absolute;
      right: 0;
      top: 30px;
    }
  `,
  teamScoreRow: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 16px;
    div:first-of-type {
      grid-column: 1 / span 2;
    }
  `,
  staffRow: css`
    grid-column: 1 / span end;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 16px;
    div:first-of-type {
      grid-column: 1 / span 3;
    }
  `,
  twoColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr [end];
    margin-bottom: 16px;
  `,
  threeColumnGrid: css`
    grid-column: 1 / span end;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr 1fr [end];
    margin-bottom: 16px;

    button {
      display: flex;
      justify-content: center;
      margin-top: 23px;
    }
  `,
  unUploadedFileArea: css`
    padding-bottom: 30px;
    padding-left: 5px;
  `,
  unUploadedFileFields: css`
    grid-column: 1 / span end;
    border-left: 4px solid ${colors.neutral_200};
    padding-left: 8px;
  `,
  oppositionCustomOptionsContainer: css`
    display: flex;
    flex-direction: column;
  `,
  oppositionCustomFreetextContainer: css`
    margin-top: 10px;
  `,
};

export default style;
