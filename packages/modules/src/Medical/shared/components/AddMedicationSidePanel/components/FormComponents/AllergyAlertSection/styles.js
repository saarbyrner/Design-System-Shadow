// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  alert: css`
    grid-column: 5 / 9;
  `,
  allergy: css`
    grid-column: 1 / 5;
  `,
  allergySection: css`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  `,
  athleteAllergy: css`
    margin-right: 12px;
  `,
  label: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.grey_100};
  `,
  textField: css`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    height: 32px;
    display: flex;
    align-items: center;
    color: ${colors.grey_200};
  `,
};
