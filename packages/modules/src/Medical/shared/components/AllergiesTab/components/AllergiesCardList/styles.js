// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyles = () => ({
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
  `,
  athleteDetails: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 40px;
    width: 40px;
  `,
  athleteInfo: css`
    flex-direction: column;
    text-align: start;
  `,
  athleteName: css`
    font-size: 13px;
    font-weight: bold;
    margin: 0px 0px 4px;
  `,
  athletePosition: css`
    color: ${colors.grey_100};
    font-size: 12px;
    margin: 0;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
    position: sticky;
    right: 0;
  `,
  allergiesTable: css`
    padding: 24px;
    .dataTable {
      overflow: auto;
    }
    .dataTable__thead {
      background: white;
    }
    .dataTable__th,
    .dataTable__td {
      background: ${colors.white};
      box-shadow: 4px 0px 3px ${colors.neutral_300};
    }
    .dataTable__td--actions {
      position: sticky;
      right: 0;
    }
  `,
  severity: css`
    display: flex;
    span {
      font-size: 14px;
      text-transform: capitalize;
    }
  `,
});

export default getStyles;
