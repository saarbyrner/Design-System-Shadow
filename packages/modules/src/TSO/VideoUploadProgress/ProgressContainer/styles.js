// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

export default {
  container: css`
    display: grid;
    grid-template-columns: 24px calc(100% - 48px) 24px;
    justify-content: space-evenly;
    align-items: center;
    height: 40px;
    padding: 0px 12px;
    border-bottom: 0.5px solid ${colors.neutral_300};

    p {
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
    }

    span {
      align-self: center;
      justify-self: center;

      &::before {
        font-size: 18px;
      }
    }

    button {
      color: ${colors.s18};
    }

    button:hover {
      color: ${colors.s18};
      text-decoration: underline;
    }
  `,
  deleteButton: css`
    border: 0;
    background: 0;
    justify-self: center;
    height: 20px;
  `,
  titleButton: css`
    justify-self: start;
    border: 0;
    background: 0;
    margin: 0;
    padding: 8px 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    text-align: left;
  `,
};
