// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  progressBarContainer: css`
    position: relative;
  `,
  progressBarBackground: css`
    background: ${colors.neutral_200};
    border: 0;
    border-radius: 8px;
    height: 8px;
  `,
  progressHeadingContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  progressCurrentStatusText: css`
    font-size: 10px;
    font-weight: 400;
    color: ${colors.grey_100};
  `,
  progressDiagnostics: css`
    padding-bottom: 50px;
  `,
  progressMobileHeading: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 25px;
  `,
  progressMobileCurrentHeading: css`
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    align-items: center;
  `,
};

const currentProgressStyle = (length: number, current: number) => css`
  background: ${colors.grey_200};
  border: 0;
  border-radius: 8px;
  height: 8px;
  margin: 0;
  position: absolute;
  top: 0;
  width: ${(100 / length) * current}%;
`;

const currentProgressChevron = (isSelected: boolean, isRight: boolean) => css`
  display: flex;
  justify-content: ${isRight ? 'flex-end' : 'flex-start'};
  color: ${isSelected ? colors.grey_200 : colors.grey_100};
  pointer-events: ${!isSelected ? 'none' : 'inherit'};
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const headingStyle = (isSelected: boolean) => css`
  ${isSelected ? `color: ${colors.grey_200};` : `color: ${colors.grey_100};`}
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
`;

export default {
  style,
  currentProgressChevron,
  currentProgressStyle,
  headingStyle,
};
