// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const boldText = css`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${colors.grey_200};
`;

export default {
  club: boldText,
  teamFlag: css`
    width: 33px;
    height: 33px;
    border-radius: 50%;
  `,
};
