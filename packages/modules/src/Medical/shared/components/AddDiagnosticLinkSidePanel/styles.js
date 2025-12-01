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
  linkUri: css`
    grid-column: 2 / 2;
    margin-bottom: 16px;
  `,
  linkTitle: css`
    grid-column: 1 / 1;
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
  renderedLinkContainer: css`
    display: grid;
    grid-column: 1 / span 3;
  `,
  attachmentLink: css`
    color: ${colors.grey_200};
    font-weight: 400;
    grid-column: 1 / span 2;
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
};
