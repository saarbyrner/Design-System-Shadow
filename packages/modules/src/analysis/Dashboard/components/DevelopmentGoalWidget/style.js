// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  widget: css`
    background-color: ${colors.p06};
    border: 1px solid ${colors.s13};
    border-radius: 5px;
    height: 100%;
    padding-bottom: 0;
    width: 100%;
  `,
  header: css`
    align-items: center;
    background-color: ${colors.s13};
    border-radius: 5px 5px 0 0;
    display: flex;
    height: 50px;
    justify-content: space-between;
    left: 0;
    padding: 0 20px;
    top: 0;
    width: 100%;
    z-index: 10;

    h3 {
      color: ${colors.p03};
      font-size: 14px;
      line-height: 20px;
      margin: 0;
      overflow: hidden;
      width: 100%;

      span {
        display: inline-block;
        max-width: calc(100% - 10px);
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }
    }
  `,
  headerTooltip: css`
    display: flex;
  `,
  customHeaderToolTipPadding: css`
    padding: inherit;
  `,
  tooltipBtn: css`
    background: none;
    border: 0;
    color: ${colors.p04};
    cursor: pointer;
    padding-top: 5px;
    width: 22px;

    i {
      font-size: 18px;
    }

    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  `,
  customTooltipBtn: css`
    margin: 15px 3px 15px 6px;
    padding: unset;
    i {
      font-size: 30px;
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
  `,
  developmentGoalTooltip: css`
    min-width: 25px;
  `,
  developmentGoalsList: css`
    list-style: none;
    padding: 8px 0;
    margin: 0;

    li {
      line-height: 16px;
    }
  `,
  developmentGoalsListItem: css`
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 16px 20px;
  `,
  developmentGoalsTagList: css`
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin-botton: 4px;
      margin-right: 4px;
    }
  `,
  developmentGoalDescription: css`
    max-width: 800px;
    line-height: 20px;
    font-weight: 400;
    color: ${colors.grey_300};
    white-space: pre-wrap;
    margin-bottom: 0px;
  `,
  developmentGoalDateRange: css`
    font-size: 12px;
    font-weight: 400;
    color: ${colors.grey_300};
    line-height: 20px;
    margin-bottom: 4px;
  `,
  emptyState: css`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: ${colors.s17};
    font-size: 14px;
    font-weight: 600;
  `,
  loader: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: center;
  `,
  noPermissionOverlay: css`
    background-color: ${colors.s14};
    margin: auto;
    max-width: 1000px;

    img {
      max-height: 100%;
      max-width: 100%;
    }

    p {
      align-items: center;
      background-color: ${colors.p06};
      bottom: 0;
      color: ${colors.s17};
      display: flex;
      font-size: 14px;
      font-weight: 600;
      justify-content: center;
      left: 0;
      opacity: 0.8;
      position: absolute;
      right: 0;
      text-align: center;
      top: 0;
      z-index: 1000;
    }
  `,
  athleteName: css`
    margin: 8px 20px 0;
    font-weight: 600;
    color: ${colors.grey_300};
  `,
  totalDevelopmentGoals: css`
    color: ${colors.grey_300_50};
    font-family: Open Sans;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    padding-left: 10px;
  `,
};

export default style;
