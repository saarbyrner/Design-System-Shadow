// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export default {
  editHistory: css`
    margin-top: 20px;
    .accordion {
      padding: 8px;
      .accordion__content {
        max-height: 15vh;
        overflow-y: auto;
      }
    }
  `,
  historyTitle: css`
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    color: ${colors.grey_200};
  `,
  version: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  title: css`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.grey_200};
    margin: 8px 0;
  `,
  changeset: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  `,
  changes: css`
    font-size: 11px;
    font-weight: 400;
    line-height: 14px;
    color: ${colors.grey_200};
    strong {
      font-weight: 600;
    }
    ul {
      margin-block-end: 0;
      padding-inline-start: 12px;
    }
  `,
};
