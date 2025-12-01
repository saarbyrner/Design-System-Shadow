// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  container: css`
    width: 30%;
    background: ${colors.white};
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 14px;

    .kitmanReactSelect {
      margin-bottom: 16px;
    }
  `,
  actionContainer: css`
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: space-between;

    button:first-of-type {
      margin-right: 6px;
    }
  `,
  label: css`
    color: ${colors.grey_100};
    margin: 0;
  `,
};
