// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export const getStyles = ({
  isEditorValid,
  isDisabled,
}: {
  isEditorValid: boolean,
  isDisabled: boolean,
}) => ({
  richTextEditor: css`
    width: 100%;
    font-family: 'Open Sans';

    .remirror-theme {
      width: 100%;
      font-family: 'Open Sans';
    }
  `,
  label: css`
    color: ${colors.s18};
    font-size: 14px;
    font-weight: 600;
    margin: 10px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    ${isDisabled &&
    `
      color: ${colors.s18};
      opacity: 0.5;
    `}
  `,
  textareaLabel: css`
    margin-right: 4px;
  `,
  textareaOptional: css`
    color: ${colors.s16};
  `,
  textarea: css``,
  editorContainer: css`
    background-color: ${colors.p06};
    border: 1px solid ${colors.p04};
    border-radius: 5px;
    color: ${colors.s18};
    font-size: 14px;
    height: 100px;
    overflow-y: auto;
    padding: 11.5px;
    resize: vertical;

    .remirror-editor-wrapper {
      padding-top: 0;

      .ProseMirror.remirror-editor {
        min-height: 100px;
        box-shadow: none;
        padding: 0;
      }
    }

    ${!isEditorValid &&
    `
      color: ${colors.s25};
    `}

    ${isDisabled &&
    `
      opacity: 0.5;
    `}
  `,
  commands: css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 10px;

    button {
      background-color: ${colors.p06};
      border: 1px solid ${colors.p04};
      border-radius: 5px;
      color: ${colors.p01};
      cursor: pointer;
      height: 36px;
      margin-right: 5px;
      min-width: 36px;
      padding: 0;
      position: relative;

      i {
        font-size: 22px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      &--disabled,
      &:disabled {
        border-color: ${colors.s14};
        color: ${colors.p04};

        &:hover {
          background-color: ${colors.p06};
          border-color: ${colors.s14};
          color: ${colors.p04};
        }
      }

      &:hover {
        background-color: ${colors.blue_300} !important;
        border-color: ${colors.blue_300} !important;
        color: ${colors.p06} !important;
        cursor: pointer;
      }
    }
  `,
  charCounter: css`
    color: ${colors.s16};
    padding-top: 5px;
    text-align: right;
  `,
});

export const getStylesKDS = ({
  isEditorActive,
  isEditorValid,
  isDisabled,
  isInvalid,
}: {
  isEditorActive: boolean,
  isEditorValid: boolean,
  isDisabled: boolean,
  isInvalid: boolean,
}) => ({
  richTextEditor: css`
    width: 100%;
    font-family: 'Open Sans';

    .remirror-theme {
      width: 100%;
      font-family: 'Open Sans';
    }
  `,
  label: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  `,
  textareaLabel: css`
    margin-right: 4px;
  `,
  textareaOptional: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 400;
  `,
  textarea: css`
    background-color: ${colors.neutral_200};
    border: 2px solid ${colors.neutral_200};
    border-radius: 3px;

    ${isEditorActive &&
    `
      border-color: ${colors.blue_100};
    `}

    ${isInvalid &&
    `
      border-color: ${colors.red_100};
    `}
  `,
  editorContainer: css`
    box-sizing: content-box !important;
    color: ${colors.grey_300};
    font-size: 14px;
    height: 100px;
    overflow-y: auto;
    padding: 11.5px;
    resize: vertical;

    .remirror-editor-wrapper {
      padding-top: 0;

      .ProseMirror.remirror-editor {
        min-height: 100px;
        box-shadow: none;
        padding: 0;
      }
    }

    ${isDisabled &&
    `
      color: ${colors.grey_300_50};
    `}

    ${!isEditorValid &&
    `
      color: ${colors.s25};
    `}
  `,
  commands: css`
    border-top: 1px solid ${colors.neutral_300};
    opacity: 0.4;
    padding: 0 3px 3px;
    pointer-events: none;
    transition: opacity 0.3s ease;

    ${isEditorActive === true &&
    `
      opacity: 1;
      pointer-events: auto;
    `}

    button {
      background-color: ${colors.neutral_200};
      border: 0;
      border-radius: 3px;
      color: ${colors.grey_100};
      cursor: pointer;
      font-weight: 400;
      height: 24px;
      margin-right: 5px;
      padding: 0;
      position: relative;
      width: 24px;

      i {
        font-size: 22px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      &:disabled {
        background: ${colors.neutral_200};
        color: ${colors.grey_100_50};
        cursor: not-allowed;

        &:hover,
        &:active {
          background-color: ${colors.neutral_200};
          border-color: ${colors.s14};
          color: ${colors.grey_100_50};
          cursor: not-allowed;
        }
      }

      &:hover {
        background-color: ${colors.blue_200} !important;
        border-color: ${colors.blue_200} !important;
        color: ${colors.p06} !important;
      }
    }
  `,
  charCounter: css`
    color: ${colors.s16};
    padding-top: 5px;
    text-align: right;
  `,
});
