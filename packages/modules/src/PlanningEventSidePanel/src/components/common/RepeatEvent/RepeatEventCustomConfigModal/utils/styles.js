// @flow

import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

const inputNumericContainerSelector = '.InputNumeric__inputContainer';

export const checkboxLiStyleOverride = css({
  '> div': {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'center',
  },
  marginBottom: '0',
  '.reactCheckbox__checkbox': {
    marginRight: '0',
  },
});

const weight600Text = {
  color: colors.grey_200,
  fontWeight: 600,
  margin: 0,
};

export default {
  modal: {
    padding: '1.5rem 1.5rem 1rem',
    footer: {
      padding: 0,
    },
    height: '30rem',

    '@media (max-width: 768px)': {
      // Overwrite the overwritten legacy mobile styles in
      // packages/components/src/Modal/KitmanDesignSystem/utils.js
      padding: '1.5rem 1.5rem 1rem !important',
    },
  },
  content: {
    margin: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    rowGap: '2rem',
    ul: {
      display: 'flex',
      columnGap: '0.75rem',
    },
  },
  repeatEvery: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '0.75rem',
      '> div': {
        display: 'flex',
        columnGap: '1rem',
        [inputNumericContainerSelector]: {
          width: '3.5rem',
        },
        '> .kitmanReactSelect': {
          width: '8.5rem',
        },
      },
    },
    text: {
      color: colors.grey_200,
      margin: 0,
    },
  },
  repeatOn: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '0.75rem',
    },
    text: weight600Text,
  },
  ends: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '0.5rem',
      ul: {
        display: 'flex',
        flexDirection: 'column',
        listStyle: 'none',
        paddingLeft: 0,
        margin: 0,
        rowGap: '1rem',
        label: {
          margin: 0,
          width: '4rem',
          color: colors.grey_200,
        },
        li: {
          display: 'flex',
          alignItems: 'center',
          columnGap: '1rem',
          [inputNumericContainerSelector]: {
            width: '8rem',
            '.InputNumeric__descriptor': {
              padding: '0rem 0.5rem',
            },
          },
        },
      },
    },
    text: weight600Text,
  },
};
