// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const dragHandleWidth = 32;
const activityCellWidth = 300;
const verticalSpacing = 4;
const smallDeviceVerticalSpacing = 14;

const getStyles = (isDraggingPrinciple: boolean) => ({
  wrapper: css`
    display: grid;
    margin-top: 30px;
    overflow-x: auto;
    position: relative;
    scroll-behavior: smooth;

    .sessionPlanningGrid > div {
      width: min-content !important;
    }

    .sessionPlanningGrid__cell {
      align-items: flex-start;
      padding: ${verticalSpacing}px;
    }

    .sessionPlanningGrid__header-cell.sessionPlanningGrid__cell--activity {
      padding-left: 24px;
    }

    .sessionPlanningGrid__row {
      align-items: flex-start;
      &.sessionPlanningGrid__cell {
        padding: 0px ${verticalSpacing}px;
      }
    }

    @media only screen and (max-width: ${breakPoints.desktop}) {
      max-width: 100%;
      overflow: auto;
    }

    @media only screen and (max-width: ${breakPoints.tablet}) {
      .sessionPlanningGrid__cell {
        padding: ${smallDeviceVerticalSpacing}px;
      }
      .sessionPlanningGrid__row {
        &.sessionPlanningGrid__cell {
          padding: 0px ${smallDeviceVerticalSpacing}px;
        }
      }
    }
  `,

  activityLoader: css`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: absolute;
    width: 100%;
    z-index: 1;
  `,

  header: css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    height: 30px;
    border-bottom: 1px solid ${colors.neutral_300};

    @media only screen and (max-width: ${breakPoints.desktop}) {
      min-width: 1000px;
      width: min-content;
    }

    @media only screen and (max-width: ${breakPoints.tablet}) {
      display: none;
    }

    span {
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
    }
  `,

  row: css`
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    position: relative;
    border-bottom: 1px solid ${colors.neutral_300};

    .sessionPlanningGrid__cell .icon-edit {
      color: inherit;
      font-weight: bold;
      margin-left: 6px;
    }

    @media only screen and (min-width: ${breakPoints.tablet}) {
      min-height: 40px;
    }

    @media only screen and (min-width: ${breakPoints.desktop}) {
      .sessionPlanningGrid__cell .icon-edit {
        display: none;
      }
    }

    &:hover {
      background-color: ${colors.blue_50};
      .sessionPlanningGrid__cell {
        background-color: ${isDraggingPrinciple && colors.blue_50};
      }

      @media only screen and (min-width: ${breakPoints.desktop}) {
        .sessionPlanningGrid__cell .icon-edit {
          display: block;
        }
      }
    }

    @media only screen and (max-width: ${breakPoints.desktop}) {
      min-width: 1000px;
      width: min-content;
    }

    @media only screen and (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      background-color: ${colors.p06};
      flex-direction: column;
      justify-content: flex-start;
      min-width: auto;
      position: relative;
      width: auto;
    }

    @media only screen and (min-width: ${breakPoints.tablet}) {
      .sessionPlanningGrid__cell--principle {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }
    }
  `,

  draggingRow: css`
    background-color: ${colors.blue_50};
    cursor: move;
    box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px,
      rgb(0 0 0 / 30%) 0px 10px 10px -5px;
  `,

  rowVeil: css`
    box-shadow: inset 0px 0px 8px 2px ${colors.blue_50};
    height: 100%;
    justify-content: center;
    left: auto;
    position: absolute;
    width: 100%;
    z-index: 1;
  `,

  cell: css`
    line-height: 16px;
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    min-width: 240px;
    max-width: 240px;
    position: relative;

    ul {
      margin: 0 0 0 10px;
      padding: 0;
    }

    @media only screen and (max-width: ${breakPoints.tablet}) {
      ul {
        margin: 0;
      }
    }

    li {
      list-style: none;
      line-height: 0px;
      margin-bottom: 5px;
    }

    &.sessionPlanningGrid__cell--activity {
      max-width: ${activityCellWidth}px;
      min-width: ${activityCellWidth}px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      @media only screen and (max-width: ${breakPoints.tablet}) {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    &.sessionPlanningGrid__cell--activity-expanded {
      min-width: ${activityCellWidth + dragHandleWidth}px;
      max-width: ${activityCellWidth + dragHandleWidth}px;
    }

    &.sessionPlanningGrid__cell--principle {
      max-width: 400px;
      min-width: 400px;
    }

    &.sessionPlanningGrid__cell--duration {
      max-width: 220px;
      min-width: 220px;
    }

    &.sessionPlanningGrid__cell--athletes {
      max-width: 90px;
      min-width: 90px;
    }

    &.sessionPlanningGrid__cell--menu {
      max-width: initial;
      min-width: auto;
    }

    &.sessionPlanningGrid__cell--duration,
    &.sessionPlanningGrid__cell--athletes,
    &.sessionPlanningGrid__cell--menu {
      min-height: 40px;
    }

    @media only screen and (max-width: ${breakPoints.tablet}) {
      min-width: auto;
      max-width: initial;
      position: static;

      &.sessionPlanningGrid__cell--activity,
      &.sessionPlanningGrid__cell--principle,
      &.sessionPlanningGrid__cell--duration,
      &.sessionPlanningGrid__cell--athletes {
        max-width: initial;
        min-width: auto;
      }

      &.sessionPlanningGrid__cell--menu {
        align-self: flex-end;
        padding-bottom: 0;
        padding-top: 0;
      }

      &.sessionPlanningGrid__cell--principle button {
        margin-bottom: 5px;
      }
    }
  `,

  drillCell: css`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    img {
      display: inline-block;
      border-radius: 3px;
      max-width: 40px;
      max-height: 40px;
    }
  `,

  activityCounter: css`
    align-self: center;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      color: ${colors.grey_100};
      font-weight: 600;
    }
  `,

  activityTypeSelect: css`
    min-width: 250px;
    margin: 0 0 0 15px;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      min-width: 220px;
      margin: 10px 0 0;
    }
  `,

  menuTrigger: css`
    background: none;
    border: 0;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    padding-left: 16px;
    position: absolute;
    right: 15px;
    text-align: left;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    @media only screen and (max-width: ${breakPoints.tablet}) {
      top: 15px;
      transform: translateY(0);
    }
  `,

  emptyTableText: css`
    color: ${colors.grey_200};
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 30px;
    margin-top: 30px;
    text-align: center;
  `,

  mobileHeading: css`
    color: ${colors.grey_100};
    font-weight: 600;
    margin: 0 4px 10px 0;
    text-transform: uppercase;
    @media only screen and (min-width: ${breakPoints.tablet}) {
      display: none;
    }
  `,

  dragHandle: css`
    cursor: move;
    font-weight: 400;
    font-size: ${dragHandleWidth}px;
    margin-top: ${verticalSpacing}px;
  `,

  underlayRow: css`
    opacity: 0;
  `,

  lastRow: css`
    border-bottom: 0;
  `,
});

export default getStyles;
