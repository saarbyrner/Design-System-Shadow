// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  linkContainer: css`
    display: grid;
    grid-column: span 2;
    grid-row: 10;
    column-gap: 8px;
    grid-template-columns: 1fr 1fr 0.2fr;
    margin-top: 16px;
  `,
  linksHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;

    h3 {
      font-size: 18px;
      margin-bottom: 0;
    }

    .textButton__icon::before {
      font-size: 20px;
    }
  `,
  linkTitle: css`
    grid-column: 1 / 1;
    margin-bottom: 16px;
  `,
  linkUri: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  linkAddButton: css`
    grid-column: 3/3;
    margin: 16px 0px;
    padding-top: 8px;
  `,
  linkRender: css`
    background-color: ${colors.neutral_100};
    border-color: ${colors.neutral_100};
    align-items: center;
    color: ${colors.grey_200};
    display: flex;
    margin-bottom: 8px;
  `,
  attachmentLink: css`
    color: ${colors.grey_200};
    font-weight: 400;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
  gridRow11: css`
    grid-row: 11;
  `,
  span3: css`
    grid-column: span 3;
  `,
  hr: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 3;
    margin: 16px 0;
    opacity: 0.5;
  `,
};
