// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
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
    gap: 5px;
  `,
  attachmentsContainer: css`
    display: flex;
    flex-wrap: wrap;
  `,

  athleteAvatar: css`
    border-radius: 50%;
    height: 45px;
    width: 45px;
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
  `,
  procedureTable: css`
    padding: 24px;
    .dataTable {
      overflow: auto;
    }
    .dataTable__thead {
      background: white;
      border-top: 1px solid ${colors.neutral_300};
    }
    .dataTable__th,
    .dataTable__td {
      background: ${colors.white};
      box-shadow: 4px 0px 3px ${colors.neutral_300};
      padding-left: 0;
      padding-right: 20px;
    }
  `,
  issueLinks: css`
    display: inline;
    a {
      margin-bottom: 5px;
    }
  `,
};
