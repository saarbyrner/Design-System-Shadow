// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  wrapper: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    margin-bottom: 16px;
  `,
  header: css`
    display: grid;
    grid-template-columns: 55% 15% 30%;
    align-items: center;
    justify-items: center;
    margin-bottom: 24px;

    button {
      justify-self: end;
    }
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin: 0;
    justify-self: start;
  `,
  line: css`
    padding-bottom: 10px;
  `,
  detailLabel: css`
    font-weight: 600;
    color: ${colors.s18};
  `,
  pdfLink: css`
    font-weight: 600;
    color: ${colors.s18};

    :hover {
      color: ${colors.s18};
      text-decoration: underline;
    }

    :visited {
      color: ${colors.s18};
    }
  `,
  icon: css`
    padding-right: 4px;
  `,
  pill: css`
    padding: 2px 6px;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    width: max-content;
    font-size: 12px;
    font-weight: 600;
    justify-self: start;

    &.workersCompPill--submitted {
      background: ${colors.green_100_20};
      color: ${colors.green_300};
    }

    &.workersCompPill--draft {
      background: ${colors.blue_100_10};
      color: ${colors.blue_300};
    }
  `,
};
