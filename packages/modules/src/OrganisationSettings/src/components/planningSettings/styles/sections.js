// @flow
import { css } from '@emotion/react';
import { colors, shadows, breakPoints } from '@kitman/common/src/variables';

export default {
  sections: css`
    display: grid;
    grid-gap: 24px;
    grid-template-columns: 1fr 1fr;
  `,
  section: css`
    background-color: ${colors.p06};
    border-radius: 3px;
    box-shadow: ${shadows.section};
    padding: 26px 24px;
    overflow: auto;
    &:first-of-type {
      grid-column: 1/3;
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      grid-column: 1/3;
    }
  `,
  sectionHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  `,
  sectionHeaderTitle: css`
    color: ${colors.grey_300};
    font-size: 20px;
    margin: 0;
  `,
  sectionHeaderActions: css`
    display: flex;
    button {
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  sectionHeaderMobileActions: css`
    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
};
