// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';
import { singleRowClassname } from './consts';

type CreateRowEndContainerStyle = {
  isNewRow: boolean,
};
export const createRowEndContainerStyle = ({
  isNewRow,
}: CreateRowEndContainerStyle) =>
  css({
    display: 'grid',
    gap: '0.5rem',
    gridTemplateColumns: `auto ${isNewRow ? '1.75rem' : ''}`,
    button: {
      padding: '0.25rem 0.185rem',
      minWidth: '1.5rem',
      width: '1.5rem',
      height: '1.5rem',
      '::before': {
        fontSize: '1.5rem',
      },
    },
  });

export default {
  rowsContainer: css({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
    [`.${singleRowClassname}:has(input.km-error) + div`]: {
      marginTop: '1.25rem',
    },
  }),
  singleRowContainer: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  }),

  headerText: css({
    color: colors.grey_100,
    fontSize: '0.75rem',
    fontWeight: 600,
    margin: '0',
  }),
};
