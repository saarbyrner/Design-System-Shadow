// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  wrapper: css`
    position: relative;
  `,
  positionLabel: (cellSize: number) => css`
    padding: ${cellSize / 7}px;
    background-color: white;
    position: absolute;
    width: max-content;
    text-align: center;
    left: 0;
    right: 0;
    top: ${cellSize + 2}px;
    line-height: ${cellSize / 3.5}px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px;
    font-size: ${cellSize / 4}px;
  `,
  position: (cellSize: number) => css`
    width: ${cellSize}px;
    height: ${cellSize}px;
    border-radius: ${cellSize / 2}px;
    background-color: rgba(232, 234, 237, 0.65);
    border: ${cellSize / 15}px solid transparent;
    transition: 0.2s;

    &.highlighted {
      border-color: ${colors.green_200};
    }

    &.selected {
      background-color: #6a7681;
    }
  `,
  positionAbbreviationContainer: (cellSize: number) => css`
    width: ${cellSize}px;
    height: ${cellSize}px;
    font-size: ${cellSize / 3}px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  `,
  positionAbbreviation: css`
    text-align: center;
    margin: 0;

    &.selected {
      color: ${colors.white};
    }
  `,
  unusedPosition: (cellSize: number) =>
    css`
      width: ${cellSize}px;
      height: ${cellSize}px;
      border: 1px;
      opacity: 0;
    `,
  dragging: css`
    z-index: 1;
  `,
  positionViewId: css`
    position: relative;
    top: 3px;
  `,
};

export default styles;
