// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyle = (
  oneDayView: boolean,
  copyMode: boolean,
  linkToMode: boolean,
  rehabGroupMode: boolean,
  editItem: boolean,
  disabled: boolean,
  isDragging: boolean,
  touchInput: boolean
) => {
  let suitableCursor = disabled ? 'not-allowed' : 'auto';
  if (!disabled) {
    if (editItem) {
      suitableCursor = 'auto';
    } else {
      suitableCursor = isDragging ? 'grabbing' : 'grab';
    }
  }

  const calculateTempColumns = () => {
    if (oneDayView) {
      if (editItem) {
        return '1fr 1fr min-content 1fr';
      }
      return linkToMode || copyMode
        ? '1fr 1fr 1fr 30px'
        : '1fr 1fr 1fr min-content';
    }
    return '1fr';
  };
  return {
    rehabItemDisplay: css`
      user-select: none;
      display: grid;
      grid-template-columns: ${calculateTempColumns()};
      background: ${colors.white};
      opacity: ${isDragging && (!copyMode || !linkToMode || !rehabGroupMode)
        ? 0.5
        : 1};
      border-bottom: 1px solid ${colors.neutral_300};
      gap: ${oneDayView ? '0px 24px' : '0px'};
      padding: ${oneDayView ? '0px' : '4px 2px 4px 2px;'};
      padding-left: ${oneDayView ? '6px' : '4px'};
      padding-right: ${oneDayView ? '6px' : '4px'};
      position: relative;
      min-height: 32px;

      :active {
        cursor: ${suitableCursor};
      }

      &:focus-within,
      &:focus {
        outline: none;
        background: ${colors.blue_25};
      }

      &:hover,
      &:focus-within {
        .rehabActionButtons {
          display: ${!editItem ? 'block' : 'none'};
        }
        .iconButton {
          display: block;
          color: ${colors.grey_200};
        }
      }
    `,
    setRepUnitsText: css`
      overflow-x: hidden;
      text-overflow: ellipsis;
    `,

    rehabEditItem: css`
      &:focus,
      &:focus-within {
        button {
          display: block;
        }
      }

      .iconButton {
        height: 24px;
        min-width: 16px;
        padding: 0px;
        display: ${oneDayView ? 'block' : 'none'};
        &:before {
          font-size: 16px;
        }
        &:focus,
        &:hover {
          filter: drop-shadow(0px 0px 5px ${colors.grey_100});
        }
      }
    `,
    iconAddButton: css`
      padding-top: ${oneDayView ? '4px' : '0px'};
    `,

    draggingNewExercise: css`
      opacity: 0.5;
    `,

    dragHandle: css`
      touch-action: none;
      font-weight: 400;
      font-size: 24px;
      display: block;
      padding: 2px 8px 8px 8px;
      cursor: grab;

      :active {
        cursor: grabbing;
      }
    `,

    editHeader: css`
      display: flex;
      justify-content: space-between;
      margin-left: ${touchInput ? '40px' : '0px'};
      min-height: 18px;

      .iconButton {
        height: 18px !important;
      }
    `,

    variationReadOnlyDisplay: css`
      color: ${colors.grey_200};
      display: grid;
      grid-auto-flow: column;
      gap: 4px;
    `,

    variationDivider: css`
      max-width: 1px;
      border-right: 1px solid ${colors.grey_200};
    `,

    variationsColumns: css`
      display: flex;
      flex-direction: column;
      padding-top: ${oneDayView ? '4px' : '0px'};
      width: fit-content;
      margin-left: 0.45em;
    `,

    variationColumn: css`
      &:first-of-type {
        padding-top: ${oneDayView ? '4px' : '0px'};
      }
      &:last-child {
        padding-bottom: ${oneDayView ? '4px' : '0px'};
      }
    `,

    titleContainer: css`
      display: flex;
      align-self: top;
      margin-left: 0.45em;
    `,

    titleText: css`
      user-select: none;
      color: ${colors.grey_200};
      font-family: Open Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      margin: 0px;
      padding-top: ${oneDayView || touchInput ? '4px' : '0px'};
      line-height: 18px;
    `,

    addVariation: css`
      width: 100%;
      color: ${colors.grey_100};
      cursor: pointer;
      align-self: center;
    `,

    addVariationDisable: css`
      width: 100%;
      color: ${colors.grey_100};
      align-self: center;
    `,

    readOnlyVariation: css`
      display: flex;
    `,

    rehabGroupContainer: css`
      display: flex;
      flex-direction: column;
      padding: 2px 0px 4px 0px;
      position: absolute;
      z-index: 1;
      height: 50px;

      .inputRadio__active {
        width: inherit;
        height: inherit;
      }
    `,
    rehabGroup: css`
      background-color: pink;
      border-radius: 8px;
      min-height: 10px;
      width: 4px;
      flex: 1;
      display: block;
      margin-top: 2px;
    `,

    comment: css`
      display: grid;
      grid-template-columns: 1fr 16px;
      padding-top: ${oneDayView ? '4px' : '0px'};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .textarea__label {
        margin: 0px;
      }
      .textarea__input {
        height: 24px;
        ::placeholder {
          color: ${colors.grey_100};
          opacity: 1;
        }
      }
    `,

    actionButton: css`
      display: flex;
      flex-direction: row;
      padding-top: ${oneDayView ? '4px' : '0px'};

      .iconButton {
        background: ${colors.neutral_200};
        color: ${colors.grey_200};
        height: 24px;
        width: 24px;
        padding: 0px;
        margin-left: 4px;
        &:focus {
          filter: drop-shadow(0px 0px 5px ${colors.grey_100});
        }
      }
    `,

    addAnother: css`
      float: left;
      margin: 0px;
    `,

    actionButtons: css`
      display: flex;
      flex-direction: row;
      ${!oneDayView && `position: absolute; top: 4px; padding: 2px; right: 0;`}
      ${!oneDayView &&
      !copyMode &&
      !linkToMode &&
      !rehabGroupMode &&
      `display:none;`}
    `,

    selectCheckbox: css`
      padding-top: 4px;
    `,
  };
};

export default getStyle;
