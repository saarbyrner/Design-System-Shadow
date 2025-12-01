// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  container: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
  `,
  header: css`
    display: flex;
    flex-direction: row;
    padding: 0px 26px 9px 26px;
    border-bottom: 1px solid ${colors.neutral_300};

    p {
      margin: 0;
      font-size: 12px;
      font-family: Open Sans;
      font-style: normal;
      font-weight: 600;
      line-height: 16px;
      color: ${colors.grey_100};
    }
    p:first-of-type {
      flex: 0.4;
    }
    p:nth-of-type(2),
    p:nth-of-type(3) {
      flex: 0.15;
    }
    p:last-of-type {
      flex: 0.3;
    }
  `,
  row: css`
    display: flex;
    flex-direction: row;
    padding: 0px 26px;
    border-bottom: 1px solid ${colors.neutral_300};
    transition: 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #e7e7e7;
    }

    p {
      margin: 0;
      font-size: 14px;
      font-family: Open Sans;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      color: ${colors.grey_200};
      padding: 22px 0px;
    }
    p:first-of-type {
      flex: 0.4;
    }
    p:nth-of-type(2),
    p:nth-of-type(3) {
      flex: 0.15;
    }
    p:last-of-type {
      flex: 0.3;
    }
  `,
  rowSelected: css`
    border-left: 12px solid #45556c;
    padding-left: 12px;
  `,
  slidingPanelActions: css`
    display: flex;
    justify-content: flex-end;
    border-top: 2px solid ${colors.neutral_300};
    padding: 24px;
  `,
  headerFilters: css`
    padding: 16px 26px 0 26px;
    margin-bottom: 24px;
  `,
  filters: css`
    display: flex;
  `,
  filter: css`
    width: 120px;
    margin-right: 8px;
  `,
  lastFilter: css`
    width: 180px;
  `,
  searchBarContainer: css`
    width: 385px;
    position: relative;
  `,
};

export default styles;
