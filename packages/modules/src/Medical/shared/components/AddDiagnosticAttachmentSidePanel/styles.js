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
    padding: 24px;
    overflow: auto;
    flex: 1;
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
