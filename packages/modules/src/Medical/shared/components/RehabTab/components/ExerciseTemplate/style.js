// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyle = (disabled: boolean, isSelected: boolean) => ({
  exerciseTemplate: css`
    background-color: ${isSelected ? colors.neutral_200 : colors.white};
    min-height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
    margin-right: 16px;
    cursor: ${disabled ? 'auto' : 'pointer'};
    :hover {
      background-color: ${colors.neutral_200};
    }
    :focus {
      background-color: ${colors.neutral_200};
    }
  `,

  exerciseClickArea: css`
    display: flex;
    align-items: center;
    min-height: 40px;
    width: 100%;
  `,

  addIcon: css``,

  exerciseTitle: css`
    user-select: none;
    color: ${colors.grey_300};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    flex: 1;
    margin-left: 12px;
  `,

  dragHandle: css`
    touch-action: none;
    font-weight: 400;
    font-size: 24px;
    display: block;
    padding: 8px;
    cursor: grab;

    :active {
      cursor: grabbing;
    }
  `,
});

export default getStyle;
