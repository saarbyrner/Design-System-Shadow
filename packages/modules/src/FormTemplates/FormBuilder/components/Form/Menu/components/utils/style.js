// @flow

import { levelEnumLike } from '../../utils/enum-likes';

export const itemDetailsStartStyle = {
  [levelEnumLike.menuGroup]: {
    container: {
      marginLeft: '0.5rem',
    },
    text: {
      fontSize: '16px',
      fontWeight: 600,
    },
    numberOfChildrenText: {
      marginLeft: '1.25rem',
    },
    textLength: 20,
  },

  [levelEnumLike.menuItem]: {
    container: {
      marginLeft: '1.25rem',
    },
    text: {
      fontSize: '14px',
      fontWeight: 600,
    },
    numberOfChildrenText: {
      marginLeft: '1rem',
    },
    textLength: 18,
  },

  [levelEnumLike.question]: {
    container: {
      marginLeft: '1.875rem',
    },
    text: {
      fontSize: '12px',
    },
    // This was added to silence Flow
    numberOfChildrenText: {},
    textLength: 45,
  },

  [levelEnumLike.group]: {
    container: {
      marginLeft: '1.25rem',
    },
    text: {
      fontSize: '12px',
    },
    numberOfChildrenText: {
      marginLeft: '1.25rem',
    },
    textLength: 25,
  },
};
