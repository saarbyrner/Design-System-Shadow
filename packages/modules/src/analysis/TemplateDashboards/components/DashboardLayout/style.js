// @flow
import { css } from '@emotion/react';

export default {
  root: css`
    margin: 25px;
    margin-top: 0;
    display: flex;
    flex-direction: column;

    h6 {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--grey-100, #5f7089);
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
  `,
  section: css``,
  content: css``,
  loading: css``,
  header: css`
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;
    border-radius: 4px;

    .kitmanReactSelect {
      min-width: 200px;
    }

    .kitmanReactSelect__menu {
      max-width: fit-content;
    }
  `,
};
