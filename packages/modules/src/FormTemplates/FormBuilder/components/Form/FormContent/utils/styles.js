// @flow

import { levelEnumLike } from '../../Menu/utils/enum-likes';

export const sxByLevel = {
  [levelEnumLike.menuGroup]: { fontSize: '1.25rem', fontWeight: 600 },
  [levelEnumLike.menuItem]: { fontSize: '1rem', fontWeight: 600 },
  [levelEnumLike.group]: { fontSize: '1rem', fontWeight: 600 },
};

export const editableInputStyles = {
  container: {
    '.inputText': {
      width: '512px',
      input: {
        maxWidth: 'unset',
        width: '100%',
      },
    },
  },
};
