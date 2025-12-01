// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  sidePanel: css`
    .slidingPanel {
      display: flex;
      flex-direction: column;
    }

    .slidingPanel__heading {
      min-height: 80px;
      max-height: 80px;
    }

    .slidingPanel__heading {
      margin-bottom: 0;
    }
  `,
  content: css`
    display: grid;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    padding: 24px;
    overflow: auto;
    flex: 1;
  `,
  player: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  activeModifications: css`
    border-bottom: 1px solid ${colors.neutral_300};
    grid-column: 1 / 3;
    margin-bottom: 16px;
    padding-bottom: 8px;

    > div {
      margin-bottom: 8px;
    }
  `,
  activeModificationsLabel: css`
    color: ${colors.grey_100};
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  `,
  activeModificationTitle: css`
    color: ${colors.grey_200};
    font-weight: 600;
    margin-right: 4px;
  `,
  activeModificationDate: css`
    color: ${colors.grey_200};
  `,
  activeModificationDescription: css`
    color: ${colors.grey_200};
    margin: 0;
  `,
  modificationTitle: css`
    grid-column: 1 / 2;
    margin-bottom: 16px;
  `,
  startDate: css`
    grid-column: 1 / 2;
  `,
  endDate: css`
    grid-column: 2 / 3;
  `,
  details: css`
    grid-column: 1 / 3;
    margin: 16px 0;
  `,
  athleteIssues: css`
    grid-column: 1 / 3;
    margin-bottom: 16px;
  `,
  visibility: css`
    grid-column: 1 / 2;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: flex-end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
  `,
};
