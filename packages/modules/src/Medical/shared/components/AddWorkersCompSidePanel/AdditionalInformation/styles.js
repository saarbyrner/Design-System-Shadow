// @flow
import { css } from '@emotion/react';
import colors from '../../../../../../../common/src/variables/colors';

export default {
  content: css`
    display: grid;
    grid-template-columns: 50% 20% 25%;
    grid-auto-rows: min-content;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    flex: 1;
    padding: 8px 24px;
  `,
  header: css`
    grid-column: 1 / 2;
    margin: 0;
  `,
  lineDivider: css`
    background-color: ${colors.neutral_300};
    grid-column: 1 / 4;
    margin: 8px 0;
    opacity: 0.5;
  `,
  firstName: css`
    grid-column: 1 / 2;
    text-transform: capitalize;
  `,
  lastName: css`
    grid-column: 2 / 4;
    text-transform: capitalize;
  `,
  position: css`
    grid-column: 1 / 2;
  `,
  socialSecurityNumber: css`
    grid-column: 2 / 4;
    .iconButton::before {
      font-size: 18px;
      position: relative;
      top: 0.2em;
      right: 0.5em;
    }
    a {
      color: inherit;
    }
  `,
  inputLabel: css`
    margin-bottom: 0;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    text-transform: initial;
  `,
  address1: css`
    grid-column: 1 / 2;
  `,
  address2: css`
    grid-column: 2 / 4;
  `,
  phoneNumber: css`
    grid-column: 1 / 2;
  `,
  isInvalid: css`
    color: ${colors.red_200};
  `,
};
