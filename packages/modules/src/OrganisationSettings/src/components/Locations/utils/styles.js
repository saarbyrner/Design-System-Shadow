// @flow
import { css } from '@emotion/react';

export const customSelectStyles = {
  menu: (base: { [key: string]: string }) => {
    return { ...base, ...{ minWidth: '100%' } };
  },
};

export default {
  filtersContainer: css({
    marginBottom: '1.75rem',
    maxWidth: '47rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  }),
};
