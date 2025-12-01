// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyle = (
  oneDayView: boolean,
  copyMode: boolean,
  linkToMode: boolean,
  editItem: boolean,
  isDragging: boolean
) => {
  let suitableCursor = 'auto';
  if (editItem) {
    suitableCursor = 'auto';
  } else {
    suitableCursor = isDragging ? 'grabbing' : 'grab';
  }

  return {
    reasonInputStyles: css`
      background: ${colors.neutral_200};
      color: ${colors.grey_300};

      &:focus {
        outline: none;
        border: none;
        box-shadow: none;
      }
    `,

    addEditItemreasonContainer: css`
      display: flex;
      margin: 0.6em 0 0 0.65em;
    `,

    rehabItemReasonText: css`
      background-color: ${colors.blue_100};
      padding: 0px 6px 0px 6px;
      border-radius: 3px;
      width: fit-content;
      color: white !important;
      font-weight: 400;
      font-size: 14px;
      height: 1.4em;
    `,

    rehabItemReason: css`
      user-select: none;
      position: relative;
      display: grid;
      color: white;
      font-weight: 600;
      font-size: 11px;
      background: ${colors.white};
      opacity: ${isDragging && (!copyMode || !linkToMode) ? 0.5 : 1};
      border-bottom: 1px solid ${colors.neutral_300};
      gap: ${oneDayView ? '0px 24px' : '0px'};
      padding: ${oneDayView ? '0px 3px 2px 0px' : '8px 2px 8px 5px'};
      min-height: 32px;
      grid-template-columns: ${oneDayView ? '1fr 1fr' : 'unset'};

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
          display: ${!editItem ? 'inherit' : 'none'};
        }
        .iconButton {
          display: block;
          color: ${colors.grey_200};
        }
      }
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

    titleContainer: css`
      display: flex;
      align-self: top;
      margin-left: 0.45em;
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
      z-index: 1;
      display: flex;
      flex-direction: row;
      ${!oneDayView && `position: absolute; top: 4px; padding: 2px; right: 0;`}
      ${!oneDayView && !copyMode && !linkToMode && `display:none;`}
      ${oneDayView && `justify-content:flex-end;`}
    `,

    selectCheckbox: css`
      padding-top: 4px;
    `,
  };
};

export default getStyle;
