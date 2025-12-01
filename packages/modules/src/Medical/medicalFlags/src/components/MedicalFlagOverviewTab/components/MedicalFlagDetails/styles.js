// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    margin-bottom: 24px;

    h2 {
      color: ${colors.grey_300};
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }
  `,
  main: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  medicalFlagAdditionalInfo: css`
    display: grid;
    color: ${colors.grey_200};
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 20px;
    list-style: none;
    padding: 0px;
    li {
      line-height: 16px;
    }
  `,
  detailLabel: css`
    font-weight: 600;
  `,
  detailValue: css`
    color: ${colors.grey_200};
    display: inline-block;
    &:first-letter {
      text-transform: capitalize;
    }
  `,
  severity: css`
    span {
      font-size: 14px;
      text-transform: capitalize;
    }
  `,
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  actions: css`
    display: flex;
    gap: 8px;
  `,
};
