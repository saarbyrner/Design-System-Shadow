// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  tabs: css`
    background-color: ${colors.white};
    color: ${colors.grey_300};
    padding-top: 34px;
    margin-bottom: 24px;
  `,
  tab: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  header: css`
    margin-bottom: 16px;
  `,
  headerTitleWrapper: css`
    display: flex;
    justify-content: space-between;
  `,
  headerTitle: css`
    color: ${colors.grey_300};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 18px;
  `,
  headerFilter: css`
    display: flex;
    gap: 8px;
  `,
  filterLength: css`
    width: 240px;
  `,
  headerButton: css`
    button {
      &[disabled] {
        span {
          margin: 0 23px;
        }
      }
    }
  `,
  table: css`
    .dataGrid__cell {
      width: auto;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  `,
  athleteCell: css`
    align-items: center;
    display: flex;
    gap: 8px;
  `,
  lineLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  labelTag: css`
    margin: 1px;
  `,
};
