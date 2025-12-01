// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
  `,
  askOnEntrySection: css`
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${colors.neutral_300};
  `,
  question: css`
    font-weight: bold;
  `,
  questionAnswerList: css`
    padding: 0;
  `,
  questionAnswerDetails: css`
    color: ${colors.grey_200};
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    list-style: none;
    line-height: 16px;
    padding: 0;
    position: relative;
    margin-top: 16px;
    margin-bottom: 0;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e8eaed;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }

    li {
      line-height: 16px;
    }
  `,
};
