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
  section: css`
    overflow: auto;
    padding: 24px;
    flex: 1;
  `,
  row: css`
    position: relative;
    margin-bottom: 16px;
  `,
  'row--dualFields': css`
    display: grid;
    column-gap: 17px;
    grid-template-columns: 1fr 1fr;
  `,
  halfRow: css`
    width: 48.5%;
  `,
  content: css`
    display: grid;
    column-gap: 16px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
    flex: 1;
  `,
  'grid-1/2': css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  'grid-2/2': css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  'grid-full': css`
    grid-column: 1 / span 2;
    margin-bottom: 16px;
  `,
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 3;
    margin: 16px 0;
    opacity: 0.5;
  `,
  flexHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
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
    gap: 8px;
  `,
  attachmentsHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  copyNoteButton: css`
    position: absolute;
    right: 0;
    margin-top: -7px;
  `,
  requestErrorText: css`
    color: #c31c2b;
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  `,
  errorDataUploader: css`
    border: 1px solid #c31c2b;
    border-radius: 3px;
    border-width: 2px;
  `,
};

export const uploadedFilesErrorStyle = (isSelected: boolean) => css`
  ${isSelected === true &&
  `
        border: 1px solid #c31c2b;
        border-radius: 3px;
        border-width: 2px;
  `}
`;
