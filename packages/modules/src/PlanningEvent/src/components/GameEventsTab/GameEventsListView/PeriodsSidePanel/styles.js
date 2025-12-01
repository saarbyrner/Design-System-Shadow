// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  periodPanelContainer: css`
    display: flex;
    flex-direction: column;
    background: ${colors.white};
    box-shadow: 0px 1px 1px rgba(9, 30, 66, 0.25),
      0px 0px 1px rgba(9, 30, 66, 0.31);
    border-radius: 3px;
    margin: 0px 10px 10px 0px;
    padding: 0px 0px 24px;
    width: 250px;
  `,
  summary: css`
    display: flex;
    border-bottom: 1px solid ${colors.neutral_300};
    padding: 12px 12px 20px 24px;
    &:hover {
      background-color: ${colors.neutral_100};
      cursor: pointer;
    }
    width: 250px;

    .summary-info {
      display: flex;
      flex-direction: column;
    }
  `,
  summaryTitle: css`
    font-weight: bold;
  `,
  item: css`
    border-bottom: 1px solid ${colors.neutral_300};
    padding: 12px 12px 12px 24px;
    &:hover {
      background-color: ${colors.neutral_100};
      cursor: pointer;
    }
    &:hover .duplicateIcon {
      cursor: pointer;
      visibility: visible;
    }
    position: relative;
  `,
  add: css`
    padding: 12px 12px 12px 24px;
    font-weight: 600;
    cursor: pointer;
  `,
  duplicateIcon: css`
    visibility: hidden;
    position: absolute;
    right: 0;
    padding: 10px;
    color: ${colors.grey_200};
  `,
  selected: css`
    background-color: ${colors.blue_100_5};
  `,
  closeButton: css`
    position: inherit;
    margin: 0px 0px 20px 70px;
  `,
};

export default styles;
