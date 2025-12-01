// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  actionButtons: css`
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    align-items: center;
  `,
  actionButtonWrapper: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 4px;
    gap: 8px;
  `,
  badge: css`
    background-color: ${colors.red_100};
    border-radius: 100%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    color: ${colors.neutral_100};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Open Sans';
    box-shadow: 0 0 0 3px ${colors.background};
    position: absolute;
    top: -7px;
    left: 25px;
  `,

  button: css`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
    margin-left: 16px;
  `,

  header: css`
    align-items: flex-start;
    background: ${colors.p06};
    display: flex;
    flex-direction: column;
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px 24px 0px 24px;
    border-bottom: none;
  `,
  icon: css`
    font-size: 7px;
  `,
  iconButtonWrapper: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 4px;
    gap: 8px;
    position: relative;
    width: 32px;
    height: 32px;
    margin-left: 5px;
    background: #f1f2f3;
    border-radius: 3px;
  `,
  iframe: css`
    height: 100%;
    width: 100%;
  `,

  largeBadge: css`
    background-color: ${colors.red_100};
    border-radius: 100px;
    width: 25px;
    height: 14px;
    font-size: 10px;
    color: ${colors.neutral_100};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Open Sans';
    box-shadow: 0 0 0 3px ${colors.background};
    position: absolute;
    top: -7px;
    left: 25px;
  `,
  medicationsContainer: css`
    height: 100%;
  `,
  medicationsTableContainer: css`
    height: calc(100vh - 288px);
  `,
};
