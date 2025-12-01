// @flow
import { css } from '@emotion/react';
import { colors, zIndices } from '@kitman/common/src/variables';

export default {
  wrapperStyle: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0;
  `,
  loading: css`
    z-index: ${zIndices.draggableItemZ + 1};
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    width: -webkit-fill-available;
    width: -moz-available;
    width: stretch;
    height: 100%;
    height: -webkit-fill-available;
    height: -moz-available;
    height: stretch;
  `,

  dayColumns: css`
    flex: 1;
    display: flex;
  `,

  rehabContainer: css`
    min-width: 203px;
    flex: 1;
    display: flex;
    border-right: 1px solid ${colors.neutral_300};
    border-bottom: 1px solid ${colors.neutral_300};

    &:first-of-type {
      border-left: 1px solid ${colors.neutral_300};
    }
  `,
};
