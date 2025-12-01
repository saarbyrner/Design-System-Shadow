// @flow

import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export default {
  titleContainer: css({
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
  }),
  title: css({
    margin: 0,
  }),
  boldTitle: css({
    fontWeight: 600,
  }),
  numberContainer: css({
    backgroundColor: colors.neutral_300,
    borderRadius: '20px',
    minWidth: '16px',
    minHeight: '16px',
    aspectRatio: '1/1',
    padding: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: {
      margin: 0,
      fontSize: '12px',
      fontWeight: 600,
    },
  }),
};
