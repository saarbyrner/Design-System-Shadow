// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';

const style = {
  additionalQuestions: css`
    margin-top: 16px;
  `,
  additionalDetails: css`
    display: grid;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 18px 16px;

    li {
      line-height: 16px;
    }
  `,
  details: css`
    display: grid;
    background-color: ${colors.background};
    border-bottom: 2px solid ${colors.neutral_300};
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_200};
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 12px;
    list-style: none;
    padding: 18px 16px;

    li {
      line-height: 16px;
    }
  `,
  supplementalPathology: css`
    grid-column: 2 / 4;
  `,
  secondaryCiCodeHeading: css`
    margin-top: 16px;
  `,
};

export default style;
