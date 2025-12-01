// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

export default {
  actionButton: css`
    background: transparent;
    border: 0;
    color: ${colors.grey_200};
    outline: none;
  `,

  documentCategory: css`
    h4 {
      margin-bottom: 8px;
      text-transform: capitalize;
      color: ${colors.grey_100};
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }

    span {
      &:after {
        content: ', ';
        display: inline;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  `,
  author: css`
    margin-bottom: 16px;
    font-size: 11px;
    color: ${colors.grey_200};
    margin-top: ${'16px'};
  `,
  section: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  fileSection: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 80%;
  `,
  row: css`
    display: flex;
    flex-direction-row;
    gap: 12px;
    align-items: end;
    width: 80%;
    .richTextEditor--kitmanDesignSystem {
      width: 100%;
      margin-bottom: 16px;
    }   
    .datePicker {
      width: 100%;
    }
    .kitmanReactSelect {
      width: 100%;
    }
  `,
  status: css`
    margin-bottom: 8px;
    display: flex;
    text-transform: uppercase;
    font-weight: 600;
  `,
  hr: css`
    background-color: 1px solid ${colors.neutral_300};
    margin: 8px 0;
    opacity: 0.5;
  `,
  confidentialNotesRow: css`
    flex-direction: column;
    align-items: start;
  `,
  confidentialNotesEditIndicatorWrapper: css`
    width: 21.5rem;
    padding: 0.3rem;
  `,
  confidentialNotesEditIndicator: css`
    display: flex;
    align-items: baseline;

    .icon-info-active {
      font-size: 1rem;
      color: ${colors.grey_100};
      margin-right: 0.5rem;
    }
  `,
};
