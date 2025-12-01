// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { GameActivityKind } from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';

const baseStyle = {
  gameActivityTooltip: css`
    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 11px;
    }
  `,
  gameActivityTooltip__title: css`
    color: ${colors.grey_300};
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  `,
  gameActivityTooltip__closeBtn: css`
    background: transparent;
    border: 0;
    color: ${colors.s16};
    font-size: 22px;
    margin-right: -4px;
    padding: 0;

    &:hover {
      cursor: pointer;
    }
  `,
  gameActivityTooltip__addGameActivityBtn: css`
    margin-top: 16px;
  `,
  gameActivityForm: css`
    align-items: center;
    display: grid;
    grid-gap: 8px 10px;
  `,
  gameActivityForm__label: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
  `,
  gameActivityForm__removeBtn: css`
    background: transparent;
    border: 0;
    color: ${colors.grey_100};
    font-size: 16px;
    padding: 0;

    &:hover {
      cursor: pointer;
    }
  `,
  tooltipHeader: css`
    padding: 21px 16px 0;
  `,
  gameActivityTooltip__content: css`
    padding: 0 16px;
  `,
  tooltipFooter: css`
    border-top: 1px solid ${colors.neutral_300};
    padding: 8px 21px;
    margin-top: 8px;
    text-align: right;
  `,
};

const style = (
  gameActivityKind: GameActivityKind,
  pitchViewEnabled: boolean
) => {
  switch (gameActivityKind) {
    case eventTypes.position_change:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 240px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 1fr 36px 16px;
          `,
          positionLabel: css`
            grid-column: 2 / 3;
          `,
          minuteLabel: css`
            grid-column: 3 / 5;
          `,
          positionToLabel: css``,
          assistLabel: css``,
          errorLabel: css`
            grid-column: 1 / span 4;
          `,
        },
      };
    case pitchViewEnabled && eventTypes.sub:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 300px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 80px 1fr 16px;
          `,
          positionLabel: css``,
          minuteLabel: css`
            grid-column: 2 / 3;
          `,
          positionToLabel: css`
            grid-column: 3 / 5;
          `,
          assistLabel: css``,
          errorLabel: css`
            grid-column: 1 / span 4;
          `,
        },
      };
    case !pitchViewEnabled && eventTypes.sub:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 200px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 1fr 16px;
          `,
          positionLabel: css``,
          minuteLabel: css`
            grid-column: 2 / 4;
          `,
          positionToLabel: css``,
          assistLabel: css``,
          errorLabel: css`
            grid-column: 1 / span 3;
          `,
        },
      };
    case pitchViewEnabled && eventTypes.goal:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 240px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 50px 1fr 16px;
          `,
          positionLabel: css``,
          minuteLabel: css`
            grid-column: 2 / 3;
          `,
          positionToLabel: css``,
          assistLabel: css`
            grid-column: 3 / 5;
          `,
          errorLabel: css`
            grid-column: 1 / span 4;
          `,
        },
      };
    case !pitchViewEnabled && eventTypes.goal:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 200px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 1fr 16px;
          `,
          positionLabel: css``,
          minuteLabel: css`
            grid-column: 2 / 4;
          `,
          positionToLabel: css``,
          assistLabel: css``,
          errorLabel: css`
            grid-column: 1 / span 3;
          `,
        },
      };
    default:
      return {
        ...baseStyle,
        tooltipWidth: css`
          width: 200px;
        `,
        grid: {
          template: css`
            grid-template-columns: 12px 1fr 16px;
          `,
          positionLabel: css``,
          minuteLabel: css`
            grid-column: 2 / 4;
          `,
          positionToLabel: css``,
          assistLabel: css``,
          errorLabel: css`
            grid-column: 1 / span 3;
          `,
        },
      };
  }
};

export default style;
