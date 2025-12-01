// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  parentContainer: css`
    display: flex;
    min-height: 540px;
  `,
  firstColumn: css`
    flex: 1;
    margin-right: 16px;

    h5 {
      padding-right: 4px;
    }
  `,
  boxSection: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    padding: 24px;
    margin-bottom: 8px;
  `,
  greyText: css`
    color: ${colors.grey_200};
  `,
  link: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_200};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
  documentDetails: css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    padding-top: 16px;
    padding-bottom: 16px;
    margin-bottom: 10px;
    border-bottom: 1px solid ${colors.neutral_300};
  `,
  smallerWidth: css`
    max-width: 434px;
    min-width: 434px;
  `,
  row: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 8px;
  `,
  noteWrapper: css`
    .richTextDisplay--abbreviated {
      max-height: initial;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;

      &:after {
        background-image: none;
      }
    }
  `,
  fileTypeIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  header: css`
    font-weight: 600;
    padding-right: 3px;
  `,
  documentHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  `,
};
