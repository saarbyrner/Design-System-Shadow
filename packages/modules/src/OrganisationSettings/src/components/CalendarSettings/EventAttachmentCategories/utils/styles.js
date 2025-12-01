// @flow

import { css } from '@emotion/react';

export default {
  rows: css({
    'div:has(input.km-error) + div': {
      marginTop: '1.25rem',
    },
  }),
};
