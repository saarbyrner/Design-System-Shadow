// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  periodTimeline: css`
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    margin-top: 30px;
    padding: 0px 24px;
  `,
  periodBar: css`
    display: flex;
    width: 100%;
    margin-right: 20px;
    margin-left: 20px;
  `,
  periodSection: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: center;

    .period_length {
      position: relative;
      display: flex;
      align-items: center;
      height: 30px;
      border-right: 2px solid ${colors.purple_100};
      margin-bottom: 10px;
      cursor: pointer;

      &._first_period {
        border-right: 2px solid ${colors.purple_100};
        border-left: 1px solid ${colors.purple_100};
      }

      &._last_period {
        border-right: 1px solid ${colors.purple_100};
      }
    }
    &:hover {
      button {
        display: block;
      }
    }
  `,
  periodTitle: css`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 40px;
    color: ${colors.grey_200};
    height: 5px;

    button {
      display: none;
      margin: 1px 0px 0px 10px;
    }

    @media (max-width: ${breakPoints.tablet}) {
      button {
        display: block;
      }
    }
  `,
  periodLine: css`
    flex: 1;
    height: 2px;
    background-color: ${colors.neutral_400};
    border: none;
  `,
  periodDot: css`
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: ${colors.green_100_20};
    border-radius: 50%;
    border: 2px solid ${colors.teal_100};
    display: inline-block;
    visibility: hidden;
    margin-left: -5.5px;
  `,
  currentSection: css`
    .current_dot {
      visibility: visible;
    }
    hr {
      background-color: ${colors.blue_400};
    }
  `,
  eventLine: css`
    width: 100%;
    height: 5px;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  timelineEventContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  eventInfo: css`
    display: flex;
    flex-direction: column;
    font-size: 12px;
    position: absolute;

    &.start_period_events {
      bottom: 22px;
      left: -12px;
    }

    &.middle_period_events {
      top: -28px;
      padding: 0px 10px;
    }

    &.end_period_events {
      bottom: 22px;
    }

    .event_image {
      padding: 3px;
      img {
        width: 20px;
        height: 20px;
      }

      &:hover {
        background-color: ${colors.grey_100_50};
        border-radius: 5px;
      }
    }

    .event_total_count {
      background-color: ${colors.neutral_300};
      padding: 1px 4px;
      border-radius: 5px;
      font-size: 12px;
    }
  `,
  multipleEventRow: css`
    position: absolute;
    display: flex;
    flex-direction: row;
    background-color: ${colors.neutral_300};
    justify-content: space-between;
    padding: 5px 8px;
    top: -18px;
    border-radius: 5px;
    z-index: 100;

    .event_image {
      padding: 5px 10px;
    }
  `,
  startEndPeriodTime: css`
    font-size: 14px;
    position: absolute;
    top: 15px;
    left: -10px;
    text-align: center;
    font-weight: 700px;

    &.startPeriod {
      left: -5px;
    }

    &.endPeriod {
      left: auto;
    }
  `,
  middlePeriodTime: css`
    font-size: 12px;
    position: relative;
    top: 10px;
    padding: 0 10px;
  `,
  finishText: css`
    margin-top: 45px;
    font-size: 14px;
    color: ${colors.purple_100};
  `,
};

const currentProgressChevron = (isSelected: boolean, isRight: boolean) => css`
  display: flex;
  justify-content: ${isRight ? 'flex-end' : 'flex-start'};
  color: ${isSelected ? colors.grey_200 : colors.grey_100};
  pointer-events: ${!isSelected ? 'none' : 'inherit'};
  cursor: pointer;
  width: 24px;
  height: 24px;
  font-size: 24px;
  margin: 35px ${isRight ? '0px' : '15px'} 0px ${isRight ? '15px' : '0px'};
`;

export default { styles, currentProgressChevron };
